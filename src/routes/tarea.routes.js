/**
 * Rutas de Tareas
 * Define los endpoints de la API
 */

import express from 'express';
import tareaController from '../controllers/tarea.controller.js';
import { verificarToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(verificarToken);

// GET /api/tareas - Obtener todas las tareas
router.get('/', tareaController.obtenerTodas);

// Búsqueda por título
router.get('/buscar', tareaController.buscarPorTitulo);

// GET /api/tareas/:id - Obtener una tarea por ID
router.get('/:id', tareaController.obtenerPorId);

// Búsquedas Simples
router.get('/usuario/:usuarioId', tareaController.getTareasByUsuario);

// Búsquedas Cruzadas (Punto 2 de tu requerimiento)
router.get('/tag/:tagId', tareaController.getTareasByTag); // Tareas de un Tag
router.get('/tarea/:tareaId/tags', tareaController.getTagsByTarea); // Tags de una Tarea

// Relaciones Indirectas (Las que acabamos de hacer)
router.get('/usuario/:usuarioId/tags', tareaController.getTagsByUsuario); // Tags de una Persona
router.get('/tag/:tagId/usuarios', tareaController.getUsuariosByTag); // Personas de un Tag

// Relacionar (Punto 2: Endpoints para relacionar)
router.post('/relacionar-tag', tareaController.addTagToTarea);

// POST /api/tareas - Crear una nueva tarea
router.post('/', tareaController.crear);

// PUT /api/tareas/:id - Actualizar tarea completamente
router.put('/:id', tareaController.actualizarCompleta);


// PATCH /api/tareas/:id - Actualizar tarea parcialmente
router.patch('/:id', tareaController.actualizarParcial);

// DELETE /api/tareas/:id - Eliminar una tarea
router.delete('/:id', tareaController.eliminar);

export default router; 
