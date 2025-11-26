📝 ATOM Backend Challenge – Express + Firebase Firestore

Este backend forma parte del challenge técnico ATOM – Fullstack y provee una API REST que soporta:

Autenticación por correo electrónico

Creación automática de usuarios

CRUD completo de tareas por usuario

Persistencia en Firebase Firestore

Diseñado como una API independiente para ser consumida por un frontend en Angular 17.

🚀 Tecnologías utilizadas

Node.js + Express

Firebase Admin SDK

Firestore Database

CORS

Nodemon (modo desarrollo)

dotenv para manejo de configuraciones

📁 Estructura del proyecto
todo-api/
  src/
    config/
      firebase.js
    controllers/
      auth.controller.js
      tasks.controller.js
    routes/
      auth.routes.js
      tasks.routes.js
    index.js
  .env
  package.json
  serviceAccountKey.json (IGNORADO en git)

🔧 Configuración inicial
1. Instalar dependencias
npm install

2. Archivo .env
PORT=3000
FIREBASE_SERVICE_ACCOUNT=./serviceAccountKey.json

3. Configurar Firebase

En Firebase Console:

Crear proyecto

Ir a Project Settings → Service Accounts

“Generate new private key”

Colocar el JSON como serviceAccountKey.json en la raíz del proyecto

Asegurarte de que .gitignore lo excluye

4. Habilitar Firestore API

En Google Cloud Console:

Habilitar:
👉 https://console.developers.google.com/apis/api/firestore.googleapis.com/

5. Levantar la API

Modo desarrollo:

npm run dev


Producción:

npm start

🌐 Endpoints disponibles

Base URL:

http://localhost:3000/api

🔐 Autenticación (por email)
POST /auth/check

Verifica si existe un usuario con el correo proporcionado.

Body:

{
  "email": "usuario@ejemplo.com"
}


Respuestas:

Usuario existe:

{
  "exists": true,
  "user": {
    "id": "abc123",
    "email": "usuario@ejemplo.com",
    "createdAt": "...",
    "updatedAt": "..."
  }
}


Usuario no existe:

{
  "exists": false
}

POST /auth/register

Crea un usuario nuevo si no existe.

Body:

{
  "email": "nuevo@ejemplo.com",
  "name": "Nombre"
}


Respuesta:

{
  "message": "Usuario creado correctamente",
  "user": {
    "id": "xyz789",
    "email": "nuevo@ejemplo.com",
    "createdAt": "...",
    "updatedAt": "..."
  }
}

📝 CRUD de Tareas

Todas las tareas están asociadas al usuario mediante subcolecciones:

users/{userId}/tasks/{taskId}

📌 GET /users/:userId/tasks

Obtiene todas las tareas del usuario, ordenadas por fecha.

Ejemplo de respuesta:

[
  {
    "id": "task123",
    "title": "Comprar leche",
    "description": "Descripción opcional",
    "completed": false,
    "createdAt": "...",
    "updatedAt": "..."
  }
]

➕ POST /users/:userId/tasks

Crea una nueva tarea.

Body:

{
  "title": "Nueva tarea",
  "description": "Opcional"
}


Respuesta:

{
  "message": "Tarea creada correctamente",
  "task": { ... }
}

🔄 PATCH /users/:userId/tasks/:taskId

Actualiza una tarea existente.

Permite editar:

Título

Descripción

Estado (completed)

Body (ejemplo):

{
  "completed": true
}

🗑 DELETE /users/:userId/tasks/:taskId

Elimina una tarea del usuario.

Respuesta:

{
  "message": "Tarea eliminada correctamente"
}

🧠 Arquitectura de Controladores
auth.controller.js

Responsable de:

Verificar existencia del usuario

Registrar nuevo usuario

Validar estructura de entrada

tasks.controller.js

Responsable de:

Obtener tareas

Crear tarea

Editar tarea

Completar/descompletar

Eliminar

🔥 Manejo de Firestore

Conexión centralizada en:

src/config/firebase.js

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


Colecciones utilizadas:

users (nivel raíz)

tasks (subcolección de cada usuario)

Timestamps en formato ISO para consistencia.

🛡 CORS

Habilitado para permitir acceso desde el frontend Angular:

app.use(cors());

📦 Scripts disponibles
{
  "start": "node src/index.js",
  "dev": "nodemon src/index.js"
}

✔️ Validaciones y Manejo de Errores

Emails requeridos

Títulos de tareas obligatorios

Errores 404 cuando no existe tarea

Manejo de excepciones 500 centralizado

Respuestas JSON consistentes

🏁 Estado del Proyecto
Funcionalidad	Estado
Configuración Firebase	✅
Autenticación por correo	✅
Registro de usuario	✅
CRUD de tareas	✅
Validaciones	✅
Documentación	✅