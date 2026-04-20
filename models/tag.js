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
this.belongsToMany(models.Tarea, { through: models.TaskTag, foreignKey: 'tagId', as: 'tareas' });    }
  }
  tag.init({
    nombre: DataTypes.STRING,
    color: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Tag',
  });
  return tag;
};