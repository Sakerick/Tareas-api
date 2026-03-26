/**
 * Rutas de Tareas
 * Define los endpoints de la API
 */

import express from 'express';
import * as tareaController from '../controllers/tarea.controller.js';

const router = express.Router();
export default router;

// GET /api/tareas - Obtener todas las tareas
router.get('/', tareaController.obtenerTodas);

// GET /api/tareas/:id - Obtener una tarea por ID
router.get('/:id', tareaController.obtenerPorId);

// POST /api/tareas - Crear una nueva tarea
router.post('/', tareaController.crear);

// PUT /api/tareas/:id - Actualizar tarea completamente
router.put('/:id', tareaController.actualizarCompleta);

// PATCH /api/tareas/:id - Actualizar tarea parcialmente
router.patch('/:id', tareaController.actualizarParcial);

// DELETE /api/tareas/:id - Eliminar una tarea
router.delete('/:id', tareaController.eliminar);
