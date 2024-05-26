const express = require('express');
const { checkAuth } = require('../middleware/auth');
const { getReadingList, addToReadingList, deleteFromReadingList } = require('../controllers/readingListController');

const router = express.Router();

router.post('/add', checkAuth, addToReadingList);
router.get('/get', checkAuth, getReadingList);
router.delete('/delete/:bookId', checkAuth, deleteFromReadingList);

module.exports = router;
