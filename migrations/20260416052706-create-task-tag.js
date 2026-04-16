'use strict';
const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TaskTags', {
      taskId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Tareas', 
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      tagId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'tags',   
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TaskTags');
  }
};