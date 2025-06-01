import bcrypt from 'bcrypt';
import { createUser,loginUser, searchUsers } from '../models/query.js';
import { createAccessToken } from '../middleware/acces_token.js';

export class UsersService {

    // Método para registrar un nuevo usuario
    static async registerUser(name, email, password) { 
        const hashedPassword = await bcrypt.hash(password, 10);
        return await createUser(name, email, hashedPassword);
    }

    // Método para iniciar sesión
    static async authenticateUser(email, password) {
        const userResult = await loginUser(email);
        const user = Array.isArray(userResult) ? userResult[0] : userResult;
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        // Verificar la contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Contraseña incorrecta');
        }

        const accessToken = createAccessToken(user.id, user.name, user.email);
        return { message: 'Inicio de sesión exitoso', accessToken };
    }

    // Método para buscar usuarios
    static async searchUsers(query, currentUserId) {
    if (!query || typeof query !== 'string' || query.trim() === '') {
        throw new Error('El término de búsqueda no puede estar vacío');
    }

    return await searchUsers(query.trim(), currentUserId);
}
}