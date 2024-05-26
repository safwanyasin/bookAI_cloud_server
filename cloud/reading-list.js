const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();

app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  host: '/cloudsql/' + process.env.HOST
});

const checkAuth = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }
    req.userId = decoded.userId;
    next();
  });
};

const addToReadingList = async (req, res) => {
  const { book_id, author_name, book_name, category, description, image_url, language, page_count, publish_date, publisher, rating, review_count } = req.body;
  const userId = req.userId;

  try {
    const result = await pool.query('SELECT book_id FROM readinglist WHERE book_id = $1 AND user_id = $2', [book_id, userId]);
    if (result.rows.length > 0) {
      return res.status(200).json({ message: 'Book already exists' });
    } else {
      await pool.query(
        'INSERT INTO readinglist (book_id, user_id, author_name, book_name, category, description, image_url, language, page_count, publish_date, publisher, rating, review_count) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
        [book_id, userId, author_name, book_name, category, description, image_url, language, page_count, publish_date, publisher, rating, review_count]
      );
      return res.status(200).json({ message: 'Book added to reading list' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const getReadingList = async (req, res) => {
    const userId = req.userId;
    try {
        const result = await pool.query(
            'SELECT * FROM readinglist WHERE user_id = $1',
            [userId]
        );
        res.status(200).json({ items: result.rows.length, data: result.rows});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const deleteFromReadingList = async (req, res) => {
    const userId = req.userId;
    const { bookId } = req.params;

    try {
        const result = await pool.query('SELECT book_id FROM readinglist WHERE book_id = $1 AND user_id = $2', [bookId, userId]);
        if (result.rows.length === 0) {
          return res.status(200).json({ message: 'Book does not exist' });
        }
        await pool.query(
            'DELETE FROM readinglist WHERE user_id = $1 AND book_id = $2',
            [userId, bookId]
        );
        res.status(200).json({ message: 'Book deleted from reading list' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};

const findInReadingList = async (req, res) => {
  const userId = req.userId;
  const { bookId } = req.params;

  try {
    const result = await pool.query('SELECT book_id FROM readinglist WHERE book_id = $1 AND user_id = $2', [bookId, userId]);
    if (result.rows.length === 0) {
      return res.status(200).json({ found: false });
    } else {
      return res.status(200).json({ found: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

app.post('/add', checkAuth, addToReadingList);
app.get('/get', checkAuth, getReadingList);
app.get('/find/:bookId', checkAuth, findInReadingList);
app.delete('/delete/:bookId', checkAuth, deleteFromReadingList);

exports.readingList = app;
