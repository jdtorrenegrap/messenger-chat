import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import { createServer } from 'http';
import userRoutes from './src/routes/users_routes.js';
import chatsRoutes from './src/routes/chats_routes.js';
import { setupSocket } from './src/service/socket.js';
import cors from 'cors';

const port = process.env.PORT ?? 8000;

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(logger('dev'));

app.use('/chatcul', userRoutes);
app.use('/chatcul', chatsRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to chatCul');
});

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

setupSocket(io);

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});