// models/tarea.model.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tarea extends Model {
    static associate(models) {
      Tarea.belongsTo(models.List,    { foreignKey: 'listId' });
      Tarea.belongsTo(models.User,    { foreignKey: 'userId' });
      Tarea.hasMany(models.SubTask,   { foreignKey: 'taskId', onDelete: 'CASCADE' });
      Tarea.belongsToMany(models.Tag, { through: models.TaskTag, foreignKey: 'taskId' });
    }
  }

  Tarea.init({
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    completada: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    duedate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    priority: {
      type: DataTypes.ENUM('baja', 'media', 'alta'),
      defaultValue: 'media'
    }
  }, {
    sequelize,
    modelName: 'Tarea',
    tableName: 'Tareas'
  });

  return Tarea;
};