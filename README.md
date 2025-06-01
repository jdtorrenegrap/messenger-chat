# CulChat

CulChat es una aplicación de chat en tiempo real desarrollada con Node.js, Express y Socket.io. La aplicación permite a los usuarios registrarse, iniciar sesión, buscar contactos y chatear en conversaciones en tiempo real.

## Características

- Registro e inicio de sesión de usuarios.
- Creación y acceso a conversaciones entre usuarios.
- Mensajería en tiempo real con Socket.io.
- Búsqueda de usuarios por dirección de correo.
- Validación y autenticación mediante JWT.

## Requisitos previos

- Node.js (v14 o superior)
- Una base de datos PostgreSQL
- Documentación de la base de datos:
https://docs.google.com/document/d/1sRe0U7AWsp1mRYfKTutheZ2RNuxtg0nK9CSI2Wi9AM8/edit?usp=sharing

## Instalación

1. Clona el repositorio:
   ```sh
   git clone https://github.com/jdtorrenegrap/messenger-chat.git

2. Navega al directorio del proyecto:
   ```sh
   cd chat_CUL

3. Instala las dependencias:
   ```sh
   npm install

## Configuracioón 
Crea un archivo .env en la raíz del proyecto (ya incluido en .gitignore) con la siguiente configuración:
DATABASE_URL=postgresql://<usuario>:<contraseña>@<host>:<puerto>/<base_de_datos>
SECRET_KEY='tu_clave_secreta'
ALGORITHM=
ACCESS_TOKEN_EXPIRE=

## Uso
1. Para iniciar la aplicación en modo de desarrollo, utiliza el siguiente comando:
   ```sh
   npm run dev

## Socket.io e Integración en el Proyecto

El servidor utiliza Socket.io para gestionar la comunicación en tiempo real entre los clientes y el servidor. A continuación se explica cómo funciona la integración:

1. **Inicialización y Configuración en index.js**

   En el archivo `index.js` se crea el servidor HTTP y se instancia Socket.io. Se configura el CORS para permitir peticiones desde cualquier origen:

   ```javascript
   const server = createServer(app);
   const io = new Server(server, {
       cors: {
           origin: '*',
           methods: ['GET', 'POST']
       }
   });

## Eventos y Comunicación en tiempo real

Una vez autenticado, el servidor escucha varios eventos:

- connection: Al conectarse un nuevo cliente, se muestra en consola el identificador del usuario.
- join conversation: Permite al cliente unirse a una sala específica (por ejemplo, una conversación entre dos usuarios). Al unirse, se recupera y envía el historial de mensajes de dicha conversación.
- chat message: Este evento gestiona el envío de mensajes. Cuando un cliente envía un mensaje, éste se guarda en la base de datos y se emite a todos los clientes conectados en la sala de la conversación.
- disconnect: Se maneja la desconexión del cliente mostrando en consola un mensaje.

Cliente y Comunicación con el Servidor

Desde el lado del cliente (en script.js), se establece la conexión al servidor pasando el token para la autenticación. El cliente se une a conversaciones, envía y recibe mensajes en tiempo real, permitiendo una experiencia de chat interactiva.

Con esta configuración, la comunicación en tiempo real se integra de forma segura y eficiente, utilizando JWT para autenticar las conexiones y asegurando que cada mensaje se envía y recibe en el contexto de la conversación correcta.

Ruta de Conexión del Socket

La conexión del socket se establece sobre el mismo servidor y puerto que la API (por defecto, http://localhost:8000). Esto se debe a que el socket se inicializa en el mismo proceso del servidor HTTP, permitiendo que tanto las peticiones REST como la comunicación en tiempo real se gestionen conjuntamente. En el lado del cliente (por ejemplo, en script.js), la conexión se establece de la siguiente manera:

const socket = io('http://localhost:8000', { 
    auth: { token, serverOffset: 0 }
});

Al utilizar la misma URL, se garantiza que el cliente se conecta directamente al servidor que está autenticado mediante JWT y configurado para gestionar tanto HTTP como WebSocket.
