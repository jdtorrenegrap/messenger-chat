import { getOrCreateConversation } from "../models/query.js";

export class ChatsService {
    
    // Método para obtener o crear una conversación entre dos usuarios
    static async getOrCreateConversation(userId1, userId2) {
        try {
            const conversation = await getOrCreateConversation(userId1, userId2);
            return conversation;
        } catch (error) {
            console.error('Error al obtener o crear la conversación:', error);
            throw new Error('No se pudo obtener o crear la conversación');
        }
    }
}