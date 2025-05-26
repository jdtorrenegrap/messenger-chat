import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.SECRET_KEY;
const algorithm = process.env.ALGORITHM;
const expiresIn = parseInt(process.env.ACCESS_TOKEN_EXPIRE, 10); 

export function createAccessToken(id,name, email) {
    const expire = new Date(Date.now() + expiresIn * 60 * 1000); // Fecha actual + minutos de expiración
    const payload = {
        sub: String(id),
        name,
        email,
        iat: Math.floor(Date.now() / 1000), // Fecha actual en segundos (UNIX timestamp)
        exp: Math.floor(expire.getTime() / 1000) // Fecha de expiración en segundos (UNIX timestamp)
    };

    return jwt.sign(payload, secretKey, { algorithm });
}