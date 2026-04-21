import { Router } from 'express';
import { tagController } from '../controllers/tag.controller.js';

const router = Router();

router.get('/', tagController.listar);
router.post('/', tagController.crear);
router.get('/usuario/:usuarioId', tagController.obtenerPorUsuario);

export default router;