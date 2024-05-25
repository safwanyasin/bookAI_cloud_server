const express = require('express');
const { checkAuth } = require('../middleware/auth');
const { addStory, getStories, deleteStory } = require('../controllers/storiesController');

const router = express.Router();

router.post('/add', checkAuth, addStory);
router.get('/get', checkAuth, getStories);
router.delete('/delete/:storyID', checkAuth, deleteStory);

module.exports = router;
