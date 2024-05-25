const pool = require('../config');

const addToWishlist = async (req, res) => {
    const { book_id, author_name, book_name, category, description, image_url, language, page_count, publish_date, publisher } = req.body;
    const userId = req.userId;

    try {
        // Check if the book already exists
        let result = await pool.query('SELECT book_id FROM wishlist WHERE book_id = $1 AND user_id = $2', [book_id, userId]);
        let bookId;

        if (result.rows.length > 0) {
            res.status(200).json({message: 'Book already exists'});
        } else {
            const [result] = await db.query(
                'INSERT INTO wishlist (book_id, user_id, author_name, book_name, category, description, image_url, language, page_count, publish_date, publisher) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [book_id, userId, author_name, book_name, category, description, image_url, language, page_count, publish_date, publisher]
            );
            bookId = result.insertId;
        }

        res.status(200).json({ message: 'Book added to wishlist' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const getWishlist = async (req, res) => {
    const userId = req.userId;
    try {
        const rows = await pool.query(
            'SELECT * FROM wishlist WHERE user_id = $1',
            [userId]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const deleteFromWishlist = async (req, res) => {
    const userId = req.userId;
    const { bookId } = req.params;

    try {
        await pool.query(
            'DELETE FROM wishlist WHERE user_id = $1 AND book_id = $2',
            [userId, bookId]
        );
        res.status(200).json({ message: 'Book deleted from wishlist' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};



module.exports = {
    addToWishlist,
    getWishlist,
    deleteFromWishlist
    // addToWishlist,
    // getWishlist
};
