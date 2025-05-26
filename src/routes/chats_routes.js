import express from 'express';
import { ChatsService } from '../service/chats_service.js';
import { authenticateToken } from '../middleware/auth_whit_jwt.js';

const router = express.Router();

router.post('/conversation', authenticateToken, async (req, res) => {

    if (!req.body) {
        return res.status(400).json({ message: 'El cuerpo de la solicitud está vacío o no se envió correctamente.' });
    }

    console.log('Cuerpo de la solicitud:', req.body);

    const { targetUserId } = req.body;
    if (!targetUserId) {
        return res.status(400).json({ message: 'El ID del usuario objetivo es requerido.' });
    }

    try {
        const conversation = await ChatsService.getOrCreateConversation(req.user.sub, targetUserId);
        res.status(200).json({ conversation });
    } catch (error) {
        console.error('Error al obtener o crear la conversación:', error);
        res.status(500).json({ message: 'Error al obtener o crear la conversación', error: error.message });
    }
});
export default router;