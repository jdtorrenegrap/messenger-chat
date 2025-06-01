import jwt from 'jsonwebtoken';
import { sendMessage, getMessages } from '../models/query.js';

export function setupSocket(io) {
    // Middleware de autenticación para Socket.io
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
    
        if (!token) {
            return next(new Error('Autenticación requerida'));
        }

        jwt.verify(token, process.env.SECRET_KEY, { algorithms: [process.env.ALGORITHM] }, (err, decoded) => {
            if (err) {
                return next(new Error('Token inválido'));
            }
            socket.user = decoded;
            next();
        });
    });

    io.on('connection', (socket) => {
        console.log(`Usuario conectado: ${socket.user.sub}`);

        // Manejo del evento para unirse a una conversación
        socket.on('join conversation', async (conversationId) => {
            socket.join(`conversation-${conversationId}`);
            console.log(`Usuario ${socket.user.sub} se unió a la conversación ${conversationId}`);

            // Recuperar el historial de mensajes de la conversación
            try {
                // Si serverOffset es 0, recuperamos todos los mensajes
                const historyMessages = await getMessages(conversationId, socket.handshake.auth.serverOffset || 0);
                historyMessages.forEach(message => {
                    socket.emit('chat message', {
                        id: message.id,
                        sender: message.sender_name, 
                        content: message.content,
                        created_at: message.created_at
                    });
                });
            } catch (error) {
                console.error('Error recuperando historial de mensajes:', error);
            }
        });

        // Manejar envío de mensajes
        socket.on('chat message', async (data) => {
            const { conversationId, content } = data;

            if (!conversationId || !content) {
                return socket.emit('error', { message: 'Datos incompletos: se requiere conversationId y content' });
            }

            try {
                // Guardar el mensaje en la base de datos
                const message = await sendMessage(conversationId, socket.user.sub, content);

                // Emitir el mensaje a todos los clientes conectados en la conversación
                io.to(`conversation-${conversationId}`).emit('chat message', {
                    id: message.id,
                    sender: socket.user.name,
                    content: message.content,
                    created_at: message.created_at
                });
            } catch (error) {
                console.error('Error al enviar el mensaje:', error);
                socket.emit('error', { message: 'Error al enviar el mensaje' });
            }
        });

        socket.on('disconnect', () => {
            console.log(`Usuario desconectado: ${socket.user.sub}`);
        });
    });
}