import db from '../../models/index.js';

const { Usuario, Tarea, Tag } = db;

const adminController = {
  obtenerEstadisticas: async (req, res) => {
    try {
      if (!req.usuario?.isAdmin) {
        return res.status(403).json({ message: 'Acceso denegado: sólo administrador' });
      }

      const [usuarios, tareas, tags] = await Promise.all([
        Usuario.count(),
        Tarea.count(),
        Tag.count()
      ]);

      res.json({ usuarios, tareas, tags });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  listarUsuarios: async (req, res) => {
    try {
      if (!req.usuario?.isAdmin) {
        return res.status(403).json({ message: 'Acceso denegado: sólo administrador' });
      }

      const usuarios = await Usuario.findAll({
        attributes: ['id', 'nombre', 'email']
      });

      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default adminController;
