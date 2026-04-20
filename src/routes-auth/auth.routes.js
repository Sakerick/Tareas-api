import express from 'express';
import { login, logout, verificarAuth } from '../controllers-auth/auth.controller.js';
import { validarApiKey, verificarToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/login', validarApiKey, login);
router.post('/logout', verificarToken, logout);
router.get('/verificar', verificarToken, verificarAuth);

export default router;