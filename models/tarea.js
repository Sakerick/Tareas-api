'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tarea extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tarea.belongsTo(models.Usuario, {foreignKey: 'usuarioId', as: 'usuario'});
      Tarea.belongsTo(models.Lista, {foreignKey: 'listaId', as: 'lista'});
      Tarea.belongsToMany(models.Tag, { through: 'taskTags', foreignKey: 'taskId', as: 'tags' });
      Tarea.hasMany(models.subTarea, { foreignKey: 'tareaId', as : 'subTareas', onDelete: 'CASCADE' })
    }
  }
  Tarea.init({
    titulo: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    completada: DataTypes.BOOLEAN,
    duedate: DataTypes.DATE,
    priority: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Tarea',
  });
  return Tarea;
};