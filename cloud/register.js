const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const pool = new Pool({
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    host: '/cloudsql/' + process.env.HOST
});

exports.register = async (req, res) => {
  const { user_id, nickname, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const userCheck = await pool.query('SELECT user_id FROM users WHERE email = $1', [email]);

    if (userCheck.rows.length > 0) {
      return res.status(401).json({ error: "A user with this email already exists"})
    }

    const result = await pool.query(
      'INSERT INTO users (user_id, nickname, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, nickname, email, hashedPassword]
    );

    const token = jwt.sign({ userId: user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User created', user: result.rows[0], token: token });
  } catch (error) {
    res.status(400).json(error);
  }
}