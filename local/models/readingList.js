const pool = require('../config');

// const addBookToReadingList = async (book_id, user_id, author_name, book_name, category, description, image_url, language, page_count, publish_date, publisher) => {
//   try 


// };

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
