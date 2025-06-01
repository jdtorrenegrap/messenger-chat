import sql from '../core/db.js';

export async function createUser(name, email, hashedPassword) {
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
        throw new Error('El usuario ya existe');
    }

    const result = await sql`
        INSERT INTO users (name, email, password)
        VALUES (${name}, ${email}, ${hashedPassword})
        RETURNING id, name, email;`;
    return result[0];
}

export async function loginUser(email) {
    const user = await sql`SELECT id, name, email, password FROM users WHERE email = ${email}`;
    if (user.length === 0) {
        throw new Error('Usuario no encontrado');
    }
    return user[0];
}

export async function whereUserExists(email) {
    const user = await sql`SELECT id FROM users WHERE email = ${email}`;
    return user.length > 0;
}

export async function searchUsers(query, currentUserId) {
    const results = await sql`
        SELECT id, name, email FROM users
        WHERE email ILIKE '%' || ${query} || '%'
        AND id != ${currentUserId}
        LIMIT 10;`;
    return results;
}


export async function getOrCreateConversation(userId1, userId2) {
    const [user1, user2] = userId1 < userId2 ? [userId1, userId2] : [userId2, userId1];

    const inserted = await sql`
        INSERT INTO conversations (user1_id, user2_id)
        VALUES (${user1}, ${user2})
        ON CONFLICT (pair_key) DO NOTHING
        RETURNING id;`;

    if (inserted.length > 0) return inserted[0];

    const found = await sql`
        SELECT id FROM conversations
        WHERE pair_key = ${user1 + '-' + user2};`;

    return found[0];
}

export async function sendMessage(conversationId, senderId, content) {
    const result = await sql`
        INSERT INTO messages (conversation_id, sender_id, content)
        VALUES (${conversationId}, ${senderId}, ${content})
        RETURNING id, content, created_at;`;
    return result[0];
}

export async function getMessages(conversationId, offset = 0) {
    const result = await sql`
        SELECT m.id, m.sender_id, u.name AS sender_name, m.content, m.created_at
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.conversation_id = ${conversationId}
        ORDER BY m.created_at ASC
        LIMIT 50 OFFSET ${offset};`;
    return result;
}

export async function getOfflineMessages(conversationId, offset = 0) {
    const result = await sql`
        SELECT id, content, sender_id AS "user"
        FROM messages
        WHERE conversation_id = ${conversationId} AND id > ${offset};`;
    return result;
}

export async function getUserConversations(userId) {
    const result = await sql`
        SELECT c.id AS conversation_id,
               u.id AS partner_id,
               u.name AS partner_name,
               u.email AS partner_email,
               c.created_at
        FROM conversations c
        JOIN users u ON u.id = CASE WHEN c.user1_id = ${userId} THEN c.user2_id ELSE c.user1_id END
        WHERE c.user1_id = ${userId} OR c.user2_id = ${userId}
        ORDER BY c.created_at DESC;`;
    return result;
}