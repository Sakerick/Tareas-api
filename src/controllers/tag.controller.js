import Tag from '../../models/tag.js';
import Tarea from '../../models/tarea.js';
import Usuario from '../../models/usuario.js';

export const tagController = {
    // Listar todos los tags
    listar: async (req, res) => {
        try {
            const tags = await Tag.findAll();
            res.json(tags);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Crear un tag
    crear: async (req, res) => {
        try {
            const nuevoTag = await Tag.create(req.body);
            res.status(201).json(nuevoTag);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // RELACIÓN INDIRECTA: Todos los Tags relacionados con una Persona
    // (Tags que aparecen en las tareas de ese usuario)
    obtenerPorUsuario: async (req, res) => {
        try {
            const { usuarioId } = req.params;
            const tags = await Tag.findAll({
                include: [{
                    model: Tarea,
                    where: { usuarioId },
                    attributes: [], // No queremos datos de la tarea
                    through: { attributes: [] } // Ni de la tabla intermedia
                }],
                group: ['Tag.id'] // Evita duplicados
            });
            res.json(tags);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};