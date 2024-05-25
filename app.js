const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

app.use(express.json());

// Obtener todos los tokens
app.get('/api/tokens', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM toke_tokens');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener los tokens:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener los tokens' });
  }
});

// Guardar un nuevo token
app.post('/api/tokens', async (req, res) => {
  try {
    const { toke_token } = req.body;
    const result = await pool.query('INSERT INTO toke_tokens (toke_token) VALUES ($1) RETURNING *', [toke_token]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al guardar el token:', error);
    res.status(500).json({ error: 'Ocurrió un error al guardar el token' });
  }
});

// Puerto de escucha
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
