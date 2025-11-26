const express = require('express');
const router = express.Router();
const {
  getTasksByUser,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/tasks.controller');

// Listar tareas de un usuario
router.get('/users/:userId/tasks', getTasksByUser);

// Crear nueva tarea
router.post('/users/:userId/tasks', createTask);

// Actualizar tarea (editar info / marcar completada)
router.patch('/users/:userId/tasks/:taskId', updateTask);

// Eliminar tarea
router.delete('/users/:userId/tasks/:taskId', deleteTask);

module.exports = router;
