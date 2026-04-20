// controllers/tarea.controller.js
import db from '../../models/index.js'; // Importa el objeto db completo

// Extrae los modelos del objeto db
const { Tarea, Tag, Usuario } = db;

const tareaController = {
    obtenerTodas: async (req, res) => {
    try {
        const tareas = await Tarea.findAll({ 
            include: [
                { 
                    model: Usuario, 
                    as: 'usuario' 
                }, 
                { 
                    model: Tag, 
                    as: 'tags', // DEBE coincidir con el 'as' en Tarea.js
                    through: { attributes: [] } // Opcional: evita que traiga los datos de la tabla intermedia
                }
            ] 
        });
        res.json(tareas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
},

    obtenerPorId: async (req, res) => {
        try {
            const tarea = await Tarea.findByPk(req.params.id, { include: [Usuario, Tag] });
            if (!tarea) return res.status(404).json({ message: "Tarea no encontrada" });
            res.json(tarea);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    crear: async (req, res) => {
        try {
            const nuevaTarea = await Tarea.create(req.body);
            res.status(201).json(nuevaTarea);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    actualizarCompleta: async (req, res) => {
        try {
            await Tarea.update(req.body, { where: { id: req.params.id } });
            res.json({ message: "Tarea actualizada correctamente" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    actualizarParcial: async (req, res) => {
        try {
            await Tarea.update(req.body, { where: { id: req.params.id } });
            res.json({ message: "Tarea actualizada parcialmente" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    eliminar: async (req, res) => {
        try {
            await Tarea.destroy({ where: { id: req.params.id } });
            res.json({ message: "Tarea eliminada" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // --- BÚSQUEDAS Y RELACIONES ---

    getTareasByUsuario: async (req, res) => {
        try {
            const tareas = await Tarea.findAll({ where: { usuarioId: req.params.usuarioId }, include: [Tag] });
            res.json(tareas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getTagsByTarea: async (req, res) => {
        try {
            const tarea = await Tarea.findByPk(req.params.tareaId, { include: [Tag] });
            res.json(tarea ? tarea.Tags : []);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getTareasByTag: async (req, res) => {
        try {
            const tag = await Tag.findByPk(req.params.tagId, {
                include: [{ model: Tarea }]
            });
            res.json(tag ? tag.Tareas : []);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    addTagToTarea: async (req, res) => {
        try {
            const { tareaId, tagId } = req.body;
            const tarea = await Tarea.findByPk(tareaId);
            if (!tarea) return res.status(404).json({ message: "Tarea no encontrada" });
            await tarea.addTag(tagId);
            res.json({ message: "Tag vinculado a la tarea" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

// --- RELACIONES INDIRECTAS (Ya las tenías bien) ---

tareaController.getTagsByUsuario = async (req, res) => {
    try {
        const usuarioConTags = await Usuario.findByPk(req.params.usuarioId, {
            include: [{
                model: Tarea,
                include: [{ model: Tag, through: { attributes: [] } }]  
            }]
        });
        if (!usuarioConTags) return res.status(404).json({ message: "Usuario no encontrado" });
        const todosLosTags = usuarioConTags.Tareas.flatMap(tarea => tarea.Tags);
        const tagsUnicos = [...new Map(todosLosTags.map(tag => [tag.id, tag])).values()];
        res.json(tagsUnicos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

tareaController.getUsuariosByTag = async (req, res) => {
    try {
        const tagConUsuarios = await Tag.findByPk(req.params.tagId, {
            include: [{
                model: Tarea,
                include: [{ model: Usuario, attributes: ['id', 'nombre', 'email', 'activo'] }]
            }]
        });
        if (!tagConUsuarios) return res.status(404).json({ message: "Tag no encontrado" });
        const todosLosUsuarios = tagConUsuarios.Tareas.map(tarea => tarea.Usuario).filter(u => u !== null);
        const usuariosUnicos = [...new Map(todosLosUsuarios.map(u => [u.id, u])).values()];
        res.json(usuariosUnicos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default tareaController;