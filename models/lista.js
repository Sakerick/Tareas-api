'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lista extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Lista.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
      Lista.hasMany(models.Tarea, { foreignKey: 'listaId', as: 'tareas', onDelete : 'CASCADE' });
    }
  }
  Lista.init({
    nombre: DataTypes.STRING,
    email: DataTypes.STRING,
    color: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Lista',
  });
  return Lista;
};