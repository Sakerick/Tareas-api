import express from 'express';
import passport from 'passport';
import { login, logout, verificarAuth } from '../controllers-auth/auth.controller.js';
import { validarApiKey, verificarToken, isAuthenticated } from '../middleware/auth.middleware.js';
import tareaController from '../controllers/tarea.controller.js';
const router = express.Router();

router.post('/login', validarApiKey, login);
router.post('/logout', verificarToken, logout);
router.get('/verificar', verificarToken, verificarAuth);

// Ruta para iniciar el login (redirige a Google)
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// En tus rutas de tareas:
router.get('/tareas', isAuthenticated, tareaController.obtenerTodas);
// Ruta a la que Google devuelve al usuario
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Éxito: Redirigir al frontend o a la lista de tareas
    res.redirect('/api/tareas');
  }
);

// Cerrar sesión
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: "Sesión cerrada" });
  });
});



export default router; 