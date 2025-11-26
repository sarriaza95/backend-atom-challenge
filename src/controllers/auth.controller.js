// src/controllers/auth.controller.js
const { db } = require('../config/firebase');

// Colección de usuarios
const USERS_COLLECTION = 'users';

// POST /api/auth/check
// body: { email }
const checkUserByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'El email es obligatorio.' });
    }

    const usersRef = db.collection(USERS_COLLECTION);
    const snapshot = await usersRef.where('email', '==', email).limit(1).get();

    if (snapshot.empty) {
      // No existe
      return res.json({
        exists: false,
      });
    }

    const doc = snapshot.docs[0];
    const user = { id: doc.id, ...doc.data() };

    return res.json({
      exists: true,
      user,
    });
  } catch (error) {
    console.error('Error en checkUserByEmail:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// POST /api/auth/register
// body: { email, name? }
const registerUser = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'El email es obligatorio.' });
    }

    // Verificar que no exista ya
    const usersRef = db.collection(USERS_COLLECTION);
    const existing = await usersRef.where('email', '==', email).limit(1).get();

    if (!existing.empty) {
      const doc = existing.docs[0];
      return res.status(409).json({
        message: 'El usuario ya existe.',
        user: { id: doc.id, ...doc.data() },
      });
    }

    const now = new Date().toISOString();

    const newUser = {
      email,
      name: name || null,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await usersRef.add(newUser);

    return res.status(201).json({
      message: 'Usuario creado correctamente',
      user: { id: docRef.id, ...newUser },
    });
  } catch (error) {
    console.error('Error en registerUser:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  checkUserByEmail,
  registerUser,
};
