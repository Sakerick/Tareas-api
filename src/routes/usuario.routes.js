import express from 'express';
const router = express.Router();
import usuarioController from '../controllers/usuario.controller.js';

router.post('/', usuarioController.create);
router.put('/:id', usuarioController.update);
router.patch('/:id/status', usuarioController.toggleStatus); // Para activar/desactivar
router.delete('/:id', usuarioController.delete);
router.get('/tag/:tagId', usuarioController.obtenerPorTag);
export default router;