# API de Tareas

Backend de gestión de tareas construido con Node.js, Express, Sequelize y MariaDB. Incluye autenticación JWT con protección CSRF y soporte para login con Google OAuth.

## Características

- CRUD de tareas con asociación a usuarios y tags
- Autenticación segura con JWT y CSRF
- Login local y OAuth con Google
- Endpoints para relación entre tareas, tags y usuarios
- Administración y estadísticas básicas
- HTTPS local configurado en `server.js`

## Requisitos

- Node.js 18+ compatible con ES Modules
- MariaDB / MySQL
- Certificados SSL locales (`localhost+2-key.pem`, `localhost+2.pem`)

## Instalación

```bash
npm install
```

## Variables de entorno

Crea un archivo `.env` con al menos estas variables:

```text
PORT=3100
SESSION_SECRET=tu_secreto_de_sesion
API_KEY=local-secret-key
JWT_SECRET=local_jwt_secret
JWT_EXPIRES_IN=1h
COOKIE_MAX_AGE=86400000
CLIENT_URL=https://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=https://localhost:3100/api/auth/google/callback
```

> `API_KEY` es necesaria para el login local (`/api/auth/login`).

## Iniciar el servidor

```bash
npm start
```

O en desarrollo con nodemon:

```bash
npm run dev
```

El servidor arranca en HTTPS y por defecto usa:

- `https://localhost:3100`

## Uso local con certificados

El servidor carga los archivos:

- `localhost+2-key.pem`
- `localhost+2.pem`

Si tu cliente local no confía en el certificado, debes usar `NODE_TLS_REJECT_UNAUTHORIZED=0` en las pruebas o instalar el certificado localmente.

## Rutas principales

### Ruta base

- `GET /` - Mensaje de bienvenida

---

## Autenticación

### Login local

- `POST /api/auth/login`
- Headers:
  - `Content-Type: application/json`
  - `x-api-key: <API_KEY>`
- Body JSON:
  - `email` (string)
  - `password` (string)

Respuesta:
- Cookies: `jwt_token`, `csrf_token`
- JSON con `mensaje`, `usuario` y `csrfToken`

### Logout

- `POST /api/auth/logout` (requiere token)
- `GET /api/auth/logout` (ruta de Passport para logout de sesión)

### Verificar token

- `GET /api/auth/verificar` (requiere token)

### Estado de sesión de Passport

- `GET /api/auth/status`

### Login con Google

- `GET /api/auth/google` - Redirige a Google
- `GET /api/auth/google/callback` - Callback para OAuth

> El callback redirige a `CLIENT_URL` después del login exitoso.

---

## Endpoints de usuarios

### Crear usuario

- `POST /api/usuarios`
- Body recomendado:
  - `nombre`
  - `email`
  - `password`
  - `activo`

### Actualizar usuario

- `PUT /api/usuarios/:id`
- Body: cualquier campo de usuario válido.

### Activar / desactivar usuario

- `PATCH /api/usuarios/:id/status`
- Body:
  - `activo` (boolean)

### Eliminar usuario

- `DELETE /api/usuarios/:id`

### Obtener usuarios por tag

- `GET /api/usuarios/tag/:tagId`

> Estas rutas de usuarios no usan la verificación JWT en el código actual.

---

## Endpoints de tareas

Estas rutas sí requieren autenticación JWT y CSRF.

### Obtener tareas

- `GET /api/tareas`
- `GET /api/tareas/:id`
- `GET /api/tareas/usuario/:usuarioId`
- `GET /api/tareas/tag/:tagId`
- `GET /api/tareas/tarea/:tareaId/tags`
- `GET /api/tareas/usuario/:usuarioId/tags`
- `GET /api/tareas/tag/:tagId/usuarios`

### Buscar tareas

- `GET /api/tareas/buscar?titulo=<texto>`

### Crear tarea

- `POST /api/tareas`
- Body recomendado:
  - `titulo`
  - `descripcion`
  - `tagIds` (array de IDs de tags, opcional)

### Relacionar tag con tarea

- `POST /api/tareas/relacionar-tag`
- Body:
  - `tareaId`
  - `tagId`

### Actualizar tarea

- `PUT /api/tareas/:id` - actualización completa
- `PATCH /api/tareas/:id` - actualización parcial

### Eliminar tarea

- `DELETE /api/tareas/:id`

> Los usuarios normales solo pueden ver/editar/eliminar sus propias tareas. Un administrador puede acceder a todas.

---

## Endpoints de tags

- `GET /api/tags`
- `POST /api/tags`
- `GET /api/tags/usuario/:usuarioId`

---

## Endpoints de administración

Estas rutas requieren `verificarToken` y están protegidas.

- `GET /api/admin/stats`
- `GET /api/admin/usuarios`

---

## Notas importantes

- El login local usa credenciales en texto claro en la base de datos.
- Existe un usuario root local con email `root@local` y contraseña `rootpass`.
- El backend usa `express-session` y Passport para la sesión de Google OAuth.
- El frontend debe enviar la cookie `csrf_token` y el header `x-csrf-token` en cada petición protegida.

## Swagger

El proyecto incluye `swagger.yaml` para la definición de la API, pero no está servido automáticamente.

---

## Uso recomendado

1. Configura `.env`
2. Asegúrate de que MariaDB esté activo
3. Ejecuta `npm install`
4. Inicia con `npm start`
5. Prueba rutas con Postman, Insomnia o un frontend en `https://localhost:3000`
