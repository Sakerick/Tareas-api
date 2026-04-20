'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TaskTag extends Model {
    static associate(models) {
    }
  }

  TaskTag.init({
    taskId: {
      type: DataTypes.INTEGER,
      primaryKey: true,          // ← clave primaria compuesta
      references: {
        model: 'Tasks',
        key: 'id'
      }
    },
    tagId: {
      type: DataTypes.INTEGER,
      primaryKey: true,          // ← clave primaria compuesta
      references: {
        model: 'Tags',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'TaskTag',
    tableName: 'TaskTags',
    timestamps: false            // ← tabla pivote no necesita createdAt/updatedAt
  });

  return TaskTag;
};