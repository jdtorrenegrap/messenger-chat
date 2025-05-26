import bcrypt from 'bcrypt';
import { createUser,loginUser, searchUsers } from '../models/query.js';
import { createAccessToken } from '../middleware/acces_token.js';

export class UsersService {

    static async registerUser(name, email, password) {
        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar el nuevo usuario con la contraseña hasheada
        return await createUser(name, email, hashedPassword);
    }

    static async authenticateUser(email, password) {
        const userResult = await loginUser(email);
        // Si loginUser retorna un arreglo, tomamos el primer elemento
        const user = Array.isArray(userResult) ? userResult[0] : userResult;
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        // Verificar la contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Contraseña incorrecta');
        }

        // Crear y retornar el token de acceso
        const accessToken = createAccessToken(user.id, user.name, user.email);
        return { message: 'Inicio de sesión exitoso', accessToken };
    }

    static async searchUsers(query, currentUserId) {
    // Validación del término de búsqueda
    if (!query || typeof query !== 'string' || query.trim() === '') {
        throw new Error('El término de búsqueda no puede estar vacío');
    }

    // Ejecutar la consulta
    return await searchUsers(query.trim(), currentUserId);
}

}