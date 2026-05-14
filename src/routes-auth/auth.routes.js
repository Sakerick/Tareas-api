import express from 'express';
import passport from 'passport';
import { login, logout, verificarAuth, oauthCallback } from '../controllers-auth/auth.controller.js';
import { validarApiKey, verificarToken } from '../middleware/auth.middleware.js';
import tareaController from '../controllers/tarea.controller.js';
const router = express.Router();

router.post('/login', validarApiKey, login);
router.post('/logout', verificarToken, logout);
router.get('/verificar', verificarToken, verificarAuth);

// Ruta para iniciar el login (redirige a Google)
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/tareas', verificarToken, tareaController.obtenerTodas);

// Ruta a la que Google devuelve al usuario
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL || 'https://localhost:3000'}/login` }),
  oauthCallback
);

// Cerrar sesión
// src/routes/auth.routes.js

router.get('/logout', (req, res, next) => {
    // Passport añade la función logout a req
    req.logout((err) => {
        if (err) { return next(err); }
        
        // Destruir la sesión en el servidor (opcional pero recomendado)
        req.session.destroy(() => {
            // Limpiar la cookie del navegador
            res.clearCookie('connect.sid'); 
            
            // Redirigir al frontend al terminar
            res.redirect('https://localhost:3000/login');
        });
    });
});

// Endpoint para verificar si el usuario tiene una sesión activa
router.get('/status', (req, res) => {
    if (req.isAuthenticated()) {
        // Si está logueado, regresamos sus datos básicos
        res.json({
            loggedIn: true,
            user: req.user
        });
    } else {
        // Si no está logueado
        res.status(401).json({
            loggedIn: false,
            message: "No hay sesión activa"
        });
    }
});

export default router; 