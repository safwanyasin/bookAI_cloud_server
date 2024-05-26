const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const pool = new Pool({
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    host: '/cloudsql/' + process.env.HOST
});

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    let user = userCheck.rowCount === 0 ? false : userCheck.rows[0];
    // return res.status(200).json({value : user })
    if (user === false) {
      //return res.status(200).json({value : user })
      return res.status(401).json({error: 'Invalid email or password'});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({error: 'Invalid email or password'});
    }

    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (error) {
    return res.status(400).json(error);
  }
}