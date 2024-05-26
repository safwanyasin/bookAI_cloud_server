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

const addStory = async (req, res) => {
  const { story_id, title, content } = req.body;
  const userId = req.userId;
  try {
    const result = await pool.query('SELECT story_id FROM generatedstories WHERE story_id = $1 AND user_id = $2', [story_id, userId]);
    if (result.rows.length > 0) {
      return res.status(200).json({ message: 'Story already exists' });
    } else {
      await pool.query(
        'INSERT INTO generatedstories (story_id, user_id, title, content) VALUES ($1, $2, $3, $4)',
        [story_id, userId, title, content]
      );
      return res.status(200).json({ message: 'Story added successfully' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const getStories = async (req, res) => {
  const userId = req.userId;
  try {
    const result = await pool.query('SELECT * FROM generatedstories WHERE user_id = $1', [userId]);
    return res.status(200).json({items: result.rows.length, data: result.rows});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const deleteStory = async (req, res) => {
  const userId = req.userId;
  const { storyId } = req.params;
  try {
    const result = await pool.query('SELECT story_id FROM generatedstories WHERE story_id = $1 AND user_id = $2', [storyId, userId]);
    if (result.rows.length === 0) {
      return res.status(200).json({ message: 'Story does not exist' });
    }
    await pool.query('DELETE FROM generatedstories WHERE user_id = $1 AND story_id = $2', [userId, storyId]);
    return res.status(200).json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

app.post('/add', checkAuth, addStory);
app.get('/get', checkAuth, getStories);
app.delete('/delete/:storyId', checkAuth, deleteStory);

exports.generatedStories = app;
