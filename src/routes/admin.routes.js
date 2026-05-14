import { Router } from 'express';
import adminController from '../controllers/admin.controller.js';
import { verificarToken } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verificarToken);

router.get('/stats', adminController.obtenerEstadisticas);
router.get('/usuarios', adminController.listarUsuarios);

export default router;
