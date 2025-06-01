document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorElem = document.getElementById('error');
    
    try {
        const res = await fetch('http://localhost:8000/chatcul/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.message || 'Error en inicio de sesión');
        }
        
        const data = await res.json();
        // Cambiado de data.token a data.accessToken
        const token = data.accessToken;
        console.log('Token recibido:', token);
        
        localStorage.setItem('token', token);
        console.log('Token almacenado en localStorage:', localStorage.getItem('token'));
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        errorElem.textContent = error.message;
    }
});
