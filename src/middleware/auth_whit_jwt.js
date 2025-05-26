import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.SECRET_KEY;
const algorithm = process.env.ALGORITHM;

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extraer el token después de "Bearer"
    
    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    try {
        const payload = jwt.verify(token, secretKey, { algorithms: [algorithm] });

        if (!payload.email) {
            return res.status(401).json({ message: 'Token inválido' });
        }

        req.user = payload; // Asignar el payload al objeto req
        next(); // Continuar con el siguiente middleware o ruta
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado' });
        }
        return res.status(401).json({ message: 'Token inválido' });
    }
}