const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

const pool = new Pool({
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  host: '/cloudsql/' + process.env.HOST
});

exports.getuser = async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;

    const result = await pool.query('SELECT user_id, nickname, email FROM users WHERE user_id = $1', [req.userId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    } else {
      return res.status(500).json({ error: err.message });
    }
  }
};
