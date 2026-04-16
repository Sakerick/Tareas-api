// controllers/tarea.controller.js
import { Tarea } from '../models/index.js'; // ajusta la ruta según tu estructura

// GET /api/tareas
export const obtenerTodas = async (req, res) => {
  try {
    const { titulo } = req.query;
    const where = titulo
      ? { titulo: { [Op.like]: `%${titulo}%` } }
      : {};

    const tareas = await Tarea.findAll({ where });

    res.json({ success: true, data: tareas, count: tareas.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener las tareas', error: error.message });
  }
};

// GET /api/tareas/:id
export const obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const tarea = await Tarea.findByPk(id);

    if (!tarea) {
      return res.status(404).json({ success: false, message: `Tarea con ID ${id} no encontrada` });
    }

    res.json({ success: true, data: tarea });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener la tarea', error: error.message });
  }
};

// POST /api/tareas
export const crear = async (req, res) => {
  try {
    const { titulo, descripcion, completada, duedate, priority } = req.body;

    if (!titulo) {
      return res.status(400).json({ success: false, message: 'El campo "titulo" es requerido' });
    }

    const nuevaTarea = await Tarea.create({ titulo, descripcion, completada, duedate, priority });

    res.status(201).json({ success: true, message: 'Tarea creada exitosamente', data: nuevaTarea });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear la tarea', error: error.message });
  }
};

// PUT /api/tareas/:id
export const actualizarCompleta = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, completada, duedate, priority } = req.body;

    if (!titulo) {
      return res.status(400).json({ success: false, message: 'El campo "titulo" es requerido' });
    }

    const tarea = await Tarea.findByPk(id);

    if (!tarea) {
      return res.status(404).json({ success: false, message: `Tarea con ID ${id} no encontrada` });
    }

    await tarea.update({ titulo, descripcion, completada, duedate, priority });

    res.json({ success: true, message: 'Tarea actualizada completamente', data: tarea });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar la tarea', error: error.message });
  }
};

// PATCH /api/tareas/:id
export const actualizarParcial = async (req, res) => {
  try {
    const { id } = req.params;
    const datosParciales = req.body;

    if (Object.keys(datosParciales).length === 0) {
      return res.status(400).json({ success: false, message: 'Debe enviar al menos un campo para actualizar' });
    }

    const tarea = await Tarea.findByPk(id);

    if (!tarea) {
      return res.status(404).json({ success: false, message: `Tarea con ID ${id} no encontrada` });
    }

    await tarea.update(datosParciales);

    res.json({ success: true, message: 'Tarea actualizada parcialmente', data: tarea });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar la tarea', error: error.message });
  }
};

// DELETE /api/tareas/:id
export const eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    const tarea = await Tarea.findByPk(id);

    if (!tarea) {
      return res.status(404).json({ success: false, message: `Tarea con ID ${id} no encontrada` });
    }

    await tarea.destroy();

    res.json({ success: true, message: 'Tarea eliminada exitosamente', data: tarea });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar la tarea', error: error.message });
  }
};