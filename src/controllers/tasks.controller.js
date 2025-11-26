// src/controllers/tasks.controller.js
const { db } = require('../config/firebase');

const USERS_COLLECTION = 'users';
const TASKS_SUBCOLLECTION = 'tasks';

// GET /api/users/:userId/tasks
const getTasksByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'userId es obligatorio.' });
    }

    const tasksRef = db
      .collection(USERS_COLLECTION)
      .doc(userId)
      .collection(TASKS_SUBCOLLECTION);

    // Ordenar por fecha de creación (desc o asc según necesites)
    const snapshot = await tasksRef.orderBy('createdAt', 'desc').get();

    const tasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.json(tasks);
  } catch (error) {
    console.error('Error en getTasksByUser:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// POST /api/users/:userId/tasks
// body: { title, description? }
const createTask = async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, description } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId es obligatorio.' });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'El título de la tarea es obligatorio.' });
    }

    const now = new Date().toISOString();

    const newTask = {
      title: title.trim(),
      description: description ? description.trim() : '',
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    const tasksRef = db
      .collection(USERS_COLLECTION)
      .doc(userId)
      .collection(TASKS_SUBCOLLECTION);

    const docRef = await tasksRef.add(newTask);

    return res.status(201).json({
      message: 'Tarea creada correctamente',
      task: { id: docRef.id, ...newTask },
    });
  } catch (error) {
    console.error('Error en createTask:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// PATCH /api/users/:userId/tasks/:taskId
// body: { title?, description?, completed? }
const updateTask = async (req, res) => {
  try {
    const { userId, taskId } = req.params;
    const { title, description, completed } = req.body;

    if (!userId || !taskId) {
      return res.status(400).json({ message: 'userId y taskId son obligatorios.' });
    }

    const taskRef = db
      .collection(USERS_COLLECTION)
      .doc(userId)
      .collection(TASKS_SUBCOLLECTION)
      .doc(taskId);

    const doc = await taskRef.get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'La tarea no existe.' });
    }

    const updates = { updatedAt: new Date().toISOString() };

    if (typeof title === 'string') {
      updates.title = title.trim();
    }

    if (typeof description === 'string') {
      updates.description = description.trim();
    }

    if (typeof completed === 'boolean') {
      updates.completed = completed;
    }

    await taskRef.update(updates);

    const updatedDoc = await taskRef.get();

    return res.json({
      message: 'Tarea actualizada correctamente',
      task: { id: updatedDoc.id, ...updatedDoc.data() },
    });
  } catch (error) {
    console.error('Error en updateTask:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// DELETE /api/users/:userId/tasks/:taskId
const deleteTask = async (req, res) => {
  try {
    const { userId, taskId } = req.params;

    if (!userId || !taskId) {
      return res.status(400).json({ message: 'userId y taskId son obligatorios.' });
    }

    const taskRef = db
      .collection(USERS_COLLECTION)
      .doc(userId)
      .collection(TASKS_SUBCOLLECTION)
      .doc(taskId);

    const doc = await taskRef.get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'La tarea no existe.' });
    }

    await taskRef.delete();

    return res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    console.error('Error en deleteTask:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  getTasksByUser,
  createTask,
  updateTask,
  deleteTask,
};
