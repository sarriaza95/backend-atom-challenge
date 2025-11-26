// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { checkUserByEmail, registerUser } = require('../controllers/auth.controller');

// Verificar si el usuario existe por email
router.post('/check', checkUserByEmail);

// Crear usuario nuevo
router.post('/register', registerUser);

module.exports = router;
