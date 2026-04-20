'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. Crear Usuarios
    await queryInterface.bulkInsert('Usuarios', [
      { nombre: 'Herick', email: 'herick@example.com',password:'1234',activo: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Ana', email: 'ana@example.com', password: '123456', activo: true, createdAt: new Date(), updatedAt: new Date() }
    ], {});

    // 2. Crear Tareas
    await queryInterface.bulkInsert('Tareas', [
      { titulo: 'Aprender Sequelize', descripcion: 'Hacer los seeders', completada: false, UsuarioId: 1, createdAt: new Date(), updatedAt: new Date() },
      { titulo: 'Ir al super', descripcion: 'Comprar leche', completada: false, UsuarioId: 1, createdAt: new Date(), updatedAt: new Date() },
      { titulo: 'Revisar PRs', descripcion: 'Pendientes de la semana', completada: false, UsuarioId: 2, createdAt: new Date(), updatedAt: new Date() }
    ], {});

    // 3. Crear Tags
    await queryInterface.bulkInsert('Tags', [
      { nombre: 'Urgente', color: '#FF0000', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Estudio', color: '#00FF00', createdAt: new Date(), updatedAt: new Date() }
    ], {});

    // 4. Relacionar Tareas con Tags (TaskTag)
    // Suponiendo que Tarea 1 es 'Aprender Sequelize' y Tag 2 es 'Estudio'
    await queryInterface.bulkInsert('TaskTags', [
      { taskId: 1, tagId: 2 },
      { taskId: 1, tagId: 1 },
      { taskId: 3, tagId: 1 }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    // Borrar en orden inverso para evitar errores de llaves foráneas
    await queryInterface.bulkDelete('TaskTags', null, {});
    await queryInterface.bulkDelete('Tags', null, {});
    await queryInterface.bulkDelete('Tareas', null, {});
    await queryInterface.bulkDelete('Usuarios', null, {});
  }
};
