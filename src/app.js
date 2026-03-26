import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import tareaRoutes from './routes/tarea.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

// CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'x-csrf-token'],
  credentials: true
}));

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
app.use('/api/auth', authRoutes);
app.use('/api/tareas', tareaRoutes);

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

export default app;