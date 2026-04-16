'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class subTarea extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      subTarea.belongsTo(models.Tarea, {foreignKey: 'tareaId', as: 'tarea' });
    }
  }
  subTarea.init({
    titulo: DataTypes.STRING,
    completada: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'subTarea',
  });
  return subTarea;
};