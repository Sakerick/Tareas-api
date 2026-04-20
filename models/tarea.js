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
      this.belongsTo(models.Usuario, {foreignKey: 'usuarioId', as: 'usuario'});
      this.belongsToMany(models.Tag, { through: models.TaskTag, foreignKey: 'taskId', as: 'tags' });    }
  }
  Tarea.init({
    titulo: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    completada: DataTypes.BOOLEAN,
    usuarioId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Tarea',
  });
  return Tarea;
};