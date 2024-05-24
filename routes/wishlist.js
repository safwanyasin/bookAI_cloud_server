const express = require('express');
const { checkAuth } = require('../middleware/auth');
const { getWishlist, addToWishlist, deleteFromWishlist } = require('../controllers/wishlistController');

const router = express.Router();

router.post('/add', checkAuth, addToWishlist);
router.get('/get', checkAuth, getWishlist);
router.delete('/delete/:bookId', checkAuth, deleteFromWishlist);

module.exports = router;
