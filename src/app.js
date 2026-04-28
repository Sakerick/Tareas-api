import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import tareaRoutes from './routes/tarea.routes.js';
import authRoutes from './routes-auth/auth.routes.js';
import tagRoutes from './routes/tag.routes.js';
import usuarioRoutes from './routes/usuario.routes.js';
import session from 'express-session';
import passport from 'passport';
import '../config/passport.js'; // Configuración de Passport (Google OAuth)

const app = express();

// 2. Configuración de Sesión (Necesaria para Passport)
// En tu app.js (donde configuras express-session)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,          // OBLIGATORIO: Solo se envía por HTTPS
    sameSite: 'none',      // OBLIGATORIO: Permite que la cookie se guarde tras redirigir desde Google
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

// CORS
app.use(cors({
  origin: 'https://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'x-csrf-token'],
  credentials: true
}));

// 3. Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ← Rutas ANTES del 404
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tareas', tareaRoutes);
app.use('/api/tags', tagRoutes);

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({ message: 'API de Tareas' });
});

// 404 — siempre al final
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

// Error handler — siempre el último
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({ success: false, message: 'Error interno del servidor', error: err.message });
});

app.use(cors({
  origin: 'https://localhost:3000', // O el puerto donde corra tu Vue
  credentials: true,               // ¡Obligatorio para que la cookie se guarde!
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

export default app; 