const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/tasks.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Prefijo API
app.use('/api/auth', authRoutes);
app.use('/api', taskRoutes);

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API running' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ API escuchando en puerto ${PORT}`);
});
