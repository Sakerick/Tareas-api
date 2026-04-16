'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tag.belongsTo(models.Usuario, {foreignKey: 'usuarioId', as: 'usuario'});
      tag.belongsToMany(models.Tarea, { through: 'taskTags', foreignKey: 'tagId', as: 'tareas' });
    }
  }
  tag.init({
    nombre: DataTypes.STRING,
    color: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tag',
  });
  return tag;
};