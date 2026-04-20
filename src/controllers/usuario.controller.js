import db from '../../models/index.js';
const { Tarea, Tag, Usuario } = db;
const usuarioController = {
    // Registro
    create: async (req, res) => {
        try {
            const usuario = await Usuario.create(req.body);
            res.status(201).json(usuario);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Modificación
    update: async (req, res) => {
        try {
            await Usuario.update(req.body, { where: { id: req.params.id } });
            res.json({ message: "Usuario actualizado" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Activación / Desactivación (Cambio de estado)
    toggleStatus: async (req, res) => {
        try {
            const { activo } = req.body; // true o false
            await Usuario.update({ activo }, { where: { id: req.params.id } });
            res.json({ message: `Usuario ${activo ? 'activado' : 'desactivado'}` });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Eliminación física
    delete: async (req, res) => {
        try {
            await Usuario.destroy({ where: { id: req.params.id } });
            res.json({ message: "Usuario eliminado de la base de datos" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

export default usuarioController;