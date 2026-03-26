/**
 * Controlador de Tareas
 * Maneja las peticiones HTTP y responde con JSON
 */

import * as tareaModel from '../models/tarea.model.js';


export const obtenerTodas = (req, res) => {
  try {
    const { titulo, formato } = req.query; // Extraemos ambos parámetros
    let tareas;

    // Lógica de filtrado que ya tenías
    if (titulo) {
      tareas = tareaModel.buscarPorTitulo(titulo);
    } else {
      tareas = tareaModel.obtenerTodas();
    }

    // Lógica de Formato
    if (formato === 'text') {
      // Convertimos el array de objetos a un string legible
      const textoPlano = tareas.map(t => 
        `ID: ${t.id} | Título: ${t.titulo} | Completada: ${t.completada ? 'Sí' : 'No'}`
      ).join('\n');

      res.setHeader('Content-Type', 'text/plain'); // Forzamos tipo de contenido texto
      return res.send(textoPlano);
    }

    // Respuesta por defecto (JSON)
    res.json({
      success: true,
      data: tareas,
      count: tareas.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las tareas',
      error: error.message
    });
  }
};
// GET /api/tareas/:id - Obtener una tarea por ID
export const obtenerPorId = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido. Debe ser un número'
      });
    }
    
    const tarea = tareaModel.obtenerPorId(id);
    
    if (!tarea) {
      return res.status(404).json({
        success: false,
        message: `Tarea con ID ${id} no encontrada`
      });
    }
    
    res.json({
      success: true,
      data: tarea
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la tarea',
      error: error.message
    });
  }
};

export const obtenerPorTitulo = (req, res) => {
    try {
    const titulo = req.params.titulo;
    
    const tarea = tareaModel.obtenerPorTitulo(titulo);
    
    if (!tarea) {
      return res.status(404).json({
        success: false,
        message: `Tarea con titulo ${titulo} no encontrada`
      });
    }
    
    res.json({
      success: true,
      data: tarea
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la tarea',
      error: error.message
    });
  }
};

// POST /api/tareas - Crear una nueva tarea
export const crear = (req, res) => {
  try {
    const { titulo, completada } = req.body;
    
    // Validar datos requeridos
    if (!titulo) {
      return res.status(400).json({
        success: false,
        message: 'El campo "titulo" es requerido'
      });
    }
    
    const nuevaTarea = tareaModel.crear({ titulo, completada });
    
    res.status(201).json({
      success: true,
      message: 'Tarea creada exitosamente',
      data: nuevaTarea
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear la tarea',
      error: error.message
    });
  }
};

// PUT /api/tareas/:id - Actualizar tarea completamente
export const actualizarCompleta = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { titulo, completada } = req.body;
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido. Debe ser un número'
      });
    }
    
    // Validar datos requeridos
    if (!titulo) {
      return res.status(400).json({
        success: false,
        message: 'El campo "titulo" es requerido'
      });
    }
    
const tareaActualizada = tareaModel.actualizarParcial(id, datosParciales);
    
    if (!tareaActualizada) {
      return res.status(404).json({
        success: false,
        message: `Tarea con ID ${id} no encontrada`
      });
    }
    
    res.json({
      success: true,
      message: 'Tarea actualizada completamente',
      data: tareaActualizada
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la tarea',
      error: error.message
    });
  }
};

// PATCH /api/tareas/:id - Actualizar tarea parcialmente
export const actualizarParcial = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const datosParciales = req.body;
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido. Debe ser un número'
      });
    }
    
    // Si no hay datos para actualizar
    if (Object.keys(datosParciales).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Debe enviar al menos un campo para actualizar'
      });
    }
    
    const tareaActualizada = tareaModel.actualizarParcial(id, datosParciales);

    
    if (!tareaActualizada) {
      return res.status(404).json({
        success: false,
        message: `Tarea con ID ${id} no encontrada`
      });
    }
    
    res.json({
      success: true,
      message: 'Tarea actualizada parcialmente',
      data: tareaActualizada
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la tarea',
      error: error.message
    });
  }
};

// DELETE /api/tareas/:id - Eliminar una tarea
export const eliminar = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido. Debe ser un número'
      });
    }
    
    const tareaEliminada = tareaModel.eliminar(id);
    
    if (!tareaEliminada) {
      return res.status(404).json({
        success: false,
        message: `Tarea con ID ${id} no encontrada`
      });
    }
    
    res.json({
      success: true,
      message: 'Tarea eliminada exitosamente',
      data: tareaEliminada
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la tarea',
      error: error.message
    });
  }
};