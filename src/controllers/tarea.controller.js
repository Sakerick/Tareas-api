// controllers/tarea.controller.js
import db from '../../models/index.js'; // Importa el objeto db completo

// Extrae los modelos del objeto db
const { Tarea, Tag, Usuario } = db;

// En el backend: tarea.controller.js
export const listarTareas = async (req, res) => {
  try {
    const tareas = await Tarea.findAll({
      where: { usuarioId: req.user.id }, // <--- FILTRO CRÍTICO
      include: [{
        model: Tag,
        as: 'tags',
        through: { attributes: [] } // Limpia la tabla intermedia del JSON
      }]
    });
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const tareaController = {
    obtenerTodas: async (req, res) => {
        try {
            const filtro = req.usuario?.isAdmin ? {} : { usuarioId: req.usuario.id };
            const tareas = await Tarea.findAll({ 
                where: filtro,
                include: [
                    { model: Usuario, as: 'usuario' }, 
                    { model: Tag, as: 'tags', through: { attributes: [] } }
                ]
            });
            res.json(tareas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    obtenerPorId: async (req, res) => {
        try {
            const tarea = await Tarea.findByPk(req.params.id, {
              include: [
                { model: Usuario, as: 'usuario' },
                { model: Tag, as: 'tags', through: { attributes: [] } }
              ]
            });
            if (!tarea) return res.status(404).json({ message: "Tarea no encontrada" });
            if (!req.usuario?.isAdmin && tarea.usuarioId !== req.usuario.id) {
                return res.status(403).json({ message: 'No tienes permiso para ver esta tarea' });
            }
            res.json(tarea);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    crear: async (req, res) => {
        try {
            if (!req.usuario) {
                return res.status(401).json({ message: "Debes iniciar sesión" });
            }

            const nuevaTarea = await Tarea.create({
                titulo: req.body.titulo,
                descripcion: req.body.descripcion || '',
                completada: false,
                usuarioId: req.usuario.id
            });

            // Vincular tags si se proporcionaron
            if (req.body.tagIds && Array.isArray(req.body.tagIds) && req.body.tagIds.length > 0) {
                await nuevaTarea.addTags(req.body.tagIds);
            }

            // Recargar la tarea con tags
            const tareaConTags = await Tarea.findByPk(nuevaTarea.id, {
                include: [{ model: Tag, as: 'tags', through: { attributes: [] } }]
            });

            res.status(201).json(tareaConTags);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    getTareasByUsuarioLogueado: async (req, res) => {
        try {
            const tareas = await Tarea.findAll({ 
                where: { usuarioId: req.usuario.id },
                include: [{ model: Tag, as: 'tags', through: { attributes: [] } }] 
            });
            res.json(tareas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    actualizarCompleta: async (req, res) => {
        try {
            const tarea = await Tarea.findByPk(req.params.id);
            if (!tarea) return res.status(404).json({ message: "Tarea no encontrada" });
            if (!req.usuario.isAdmin && tarea.usuarioId !== req.usuario.id) {
                return res.status(403).json({ message: 'No tienes permiso para modificar esta tarea' });
            }
            await tarea.update(req.body);
            res.json({ data: tarea });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    actualizarParcial: async (req, res) => {
        try {
            const tarea = await Tarea.findByPk(req.params.id);
            if (!tarea) return res.status(404).json({ message: "Tarea no encontrada" });
            if (!req.usuario.isAdmin && tarea.usuarioId !== req.usuario.id) {
                return res.status(403).json({ message: 'No tienes permiso para modificar esta tarea' });
            }
            await tarea.update(req.body);
            res.json({ data: tarea });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    eliminar: async (req, res) => {
        try {
            const tarea = await Tarea.findByPk(req.params.id);
            if (!tarea) return res.status(404).json({ message: "Tarea no encontrada" });
            if (!req.usuario.isAdmin && tarea.usuarioId !== req.usuario.id) {
                return res.status(403).json({ message: 'No tienes permiso para eliminar esta tarea' });
            }
            await tarea.destroy();
            res.json({ message: "Tarea eliminada" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    buscarPorTitulo: async (req, res) => {
        try {
            const { titulo } = req.query;
            const filtroTitulo = titulo ? { titulo: { [db.Sequelize.Op.like]: `%${titulo}%` } } : {};
            const filtroUsuario = req.usuario?.isAdmin ? {} : { usuarioId: req.usuario.id };
            const tareas = await Tarea.findAll({
                where: { ...filtroTitulo, ...filtroUsuario },
                include: [{ model: Tag, as: 'tags', through: { attributes: [] } }]
            });
            res.json(tareas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getTareasByUsuario: async (req, res) => {
        try {
            if (!req.usuario.isAdmin && parseInt(req.params.usuarioId, 10) !== req.usuario.id) {
                return res.status(403).json({ message: 'No tienes permiso para ver estas tareas' });
            }
            const tareas = await Tarea.findAll({ where: { usuarioId: req.params.usuarioId }, include: [{ model: Tag, as: 'tags', through: { attributes: [] } }] });
            res.json(tareas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getTagsByTarea: async (req, res) => {
        try {
            const tarea = await Tarea.findByPk(req.params.tareaId, { include: [{ model: Tag, as: 'tags', through: { attributes: [] } }] });
            res.json(tarea ? tarea.tags : []);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getTareasByTag: async (req, res) => {
        try {
            const tag = await Tag.findByPk(req.params.tagId, {
                include: [{ model: Tarea, as: 'tareas' }]
            });
            if (!tag) return res.status(404).json({ message: 'Tag no encontrado' });
            const tareas = tag.tareas || [];
            const resultado = req.usuario.isAdmin ? tareas : tareas.filter(t => t.usuarioId === req.usuario.id);
            res.json(resultado);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    addTagToTarea: async (req, res) => {
        try {
            const { tareaId, tagId } = req.body;
            const tarea = await Tarea.findByPk(tareaId);
            if (!tarea) return res.status(404).json({ message: "Tarea no encontrada" });
            if (!req.usuario.isAdmin && tarea.usuarioId !== req.usuario.id) {
                return res.status(403).json({ message: 'No tienes permiso para modificar esta tarea' });
            }
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
        if (!req.usuario.isAdmin && parseInt(req.params.usuarioId, 10) !== req.usuario.id) {
            return res.status(403).json({ message: 'No tienes permiso para ver estas etiquetas' });
        }
        const usuarioConTags = await Usuario.findByPk(req.params.usuarioId, {
            include: [{
                model: Tarea,
                as: 'tareas',
                include: [{ model: Tag, as: 'tags', through: { attributes: [] } }]  
            }]
        });
        if (!usuarioConTags) return res.status(404).json({ message: "Usuario no encontrado" });
        const todosLosTags = usuarioConTags.tareas.flatMap(tarea => tarea.tags);
        const tagsUnicos = [...new Map(todosLosTags.map(tag => [tag.id, tag])).values()];
        res.json(tagsUnicos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

tareaController.getUsuariosByTag = async (req, res) => {
    try {
        if (!req.usuario.isAdmin) {
            return res.status(403).json({ message: 'No tienes permiso para ver estos usuarios' });
        }
        const tagConUsuarios = await Tag.findByPk(req.params.tagId, {
            include: [{
                model: Tarea,
                as: 'tareas',
                include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email', 'activo'] }]
            }]
        });
        if (!tagConUsuarios) return res.status(404).json({ message: "Tag no encontrado" });
        const todosLosUsuarios = tagConUsuarios.tareas.map(tarea => tarea.usuario).filter(u => u !== null);
        const usuariosUnicos = [...new Map(todosLosUsuarios.map(u => [u.id, u])).values()];
        res.json(usuariosUnicos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default tareaController;