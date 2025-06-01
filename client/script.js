const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'login.html';
} else {
    console.log('Token obtenido de localStorage:', token);
}

const socket = io('http://localhost:8000', { 
    auth: { token, serverOffset: 0 }
});

socket.on('connect', () => {
    console.log('Conectado al servidor con token guardado.');
});

socket.on('connect_error', (err) => {
    console.error('Error de conexión:', err.message);
    alert('Error de conexión: ' + err.message);
});

// Elementos del DOM
const searchQuery = document.getElementById('searchQuery');
const searchButton = document.getElementById('searchButton');
const searchResults = document.getElementById('searchResults');
const chatHeader = document.getElementById('chatHeader');
const conversationInfo = document.getElementById('conversationInfo');
const noChatSelected = document.getElementById('noChatSelected');
const chatMessages = document.getElementById('chatMessages');
const messages = document.getElementById('messages');
const chatInputContainer = document.getElementById('chatInputContainer');
const form = document.getElementById('form');
const input = document.getElementById('input');

// Función para mostrar el chat
function showChat(userName, conversationId) {
    noChatSelected.classList.add('hidden');
    chatHeader.classList.remove('hidden');
    chatMessages.classList.remove('hidden');
    chatInputContainer.classList.remove('hidden');
    conversationInfo.textContent = `Conversación con: ${userName}`;
    conversationInfo.dataset.conversationId = conversationId;
    messages.innerHTML = '';
}

// Recibir mensajes
socket.on('chat message', (msg) => {
    const item = document.createElement('li');
    item.textContent = `${msg.sender}: ${msg.content}`;
    messages.appendChild(item);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Buscar usuarios
searchButton.addEventListener('click', async () => {
    const query = searchQuery.value.trim();
    if (!query) {
        alert('Ingresa un criterio de búsqueda.');
        return;
    }
    try {
        const res = await fetch(`http://localhost:8000/chatcul/search?query=${encodeURIComponent(query)}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const users = await res.json();
        searchResults.innerHTML = '';
        if (users.length === 0) {
            const li = document.createElement('li');
            li.innerHTML = '<div class="contact-info"><div class="contact-name">No se encontraron usuarios</div></div>';
            li.style.cursor = 'default';
            searchResults.appendChild(li);
            return;
        }
        users.forEach(user => {
            const li = document.createElement('li');
            const avatar = document.createElement('div');
            avatar.className = 'contact-avatar';
            avatar.textContent = user.name.charAt(0).toUpperCase();
            const contactInfo = document.createElement('div');
            contactInfo.className = 'contact-info';
            const contactName = document.createElement('div');
            contactName.className = 'contact-name';
            contactName.textContent = user.name;
            const contactEmail = document.createElement('div');
            contactEmail.className = 'contact-email';
            contactEmail.textContent = user.email;
            contactInfo.appendChild(contactName);
            contactInfo.appendChild(contactEmail);
            li.appendChild(avatar);
            li.appendChild(contactInfo);
            li.addEventListener('click', async () => {
                try {
                    const resp = await fetch('http://localhost:8000/chatcul/conversation', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        },
                        body: JSON.stringify({ targetUserId: user.id })
                    });
                    const data = await resp.json();
                    const conversation = data.conversation;
                    showChat(user.name, conversation.id);
                    socket.emit('join conversation', conversation.id);
                    console.log(`Unido a la conversación ${conversation.id}`);
                } catch (err) {
                    console.error('Error al crear o unirse a la conversación:', err);
                    alert('Error al crear o unirse a la conversación');
                }
            });
            searchResults.appendChild(li);
        });
    } catch (error) {
        console.error('Error buscando usuarios:', error);
        alert('Error buscando usuarios');
    }
});

// Permitir buscar con Enter
searchQuery.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchButton.click();
    }
});

// Enviar mensajes
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const messageContent = input.value.trim();
    if (!messageContent) return;
    const conversationId = conversationInfo.dataset.conversationId;
    if (!conversationId) {
        alert('No se encontró una conversación activa.');
        return;
    }
    socket.emit('chat message', {
        conversationId,
        content: messageContent
    });
    input.value = '';
});