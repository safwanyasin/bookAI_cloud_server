const pool = require('../config');

const createUser = async (user_id, nickname, email, hashedPassword) => {
  const result = await pool.query(
    'INSERT INTO users (user_id, nickname, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
    [user_id, nickname, email, hashedPassword]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const listUsers = async () => {
    const result = await pool.query('SELECT * FROM users');
    console.log(result);
    return result;
}

module.exports = {
  createUser,
  findUserByEmail,
  listUsers
};
