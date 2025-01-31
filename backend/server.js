require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Настройка подключения к PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware для проверки авторизации
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Access denied');

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid token');
  }
};

// Пример маршрута для регистрации пользователя
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO Пользователи (username, password) VALUES ($1, $2)', [username, hashedPassword]);
    res.status(201).send('User registered');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Пример маршрута для входа в систему
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM Пользователи WHERE username = $1', [username]);
    if (result.rows.length === 0) return res.status(400).send('User not found');

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid password');

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.header('auth-token', token).send(token);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Пример маршрута для получения списка организаций
app.get('/api/organizations', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Организации');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Пример маршрута для добавления новой организации
app.post('/api/organizations', authMiddleware, async (req, res) => {
  try {
    const { Название, Адрес, Имя_руководителя, Номер_телефона, Дополнительная_информация } = req.body;
    const result = await pool.query(
      'INSERT INTO Организации (Название, Адрес, Имя_руководителя, Номер_телефона, Дополнительная_информация) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [Название, Адрес, Имя_руководителя, Номер_телефона, Дополнительная_информация]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});