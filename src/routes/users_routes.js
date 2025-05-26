import express from 'express';
import { UsersService } from '../service/users_service.js'; // Agrega la extensión .js
import { authenticateToken } from '../middleware/auth_whit_jwt.js';


const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        await UsersService.registerUser(name, email, password);
        res.status(201).json({ message: 'Usuario creado exitosamente'});
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await UsersService.authenticateUser(email, password);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(401).json({ message: 'Error al iniciar sesión', error: error.message });
    }
});

router.get('/search', authenticateToken, async (req, res) => {
    const { query } = req.query;

    try {
        // Corregir "shearchUsers" a "searchUsers"
        const result = await UsersService.searchUsers(query, req.user.sub);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error al buscar usuarios:', error);
        res.status(500).json({ message: 'Error al buscar usuarios', error: error.message });
    }
});

export default router;