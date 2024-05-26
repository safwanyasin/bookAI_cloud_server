const pool = require('../config');

const addToReadingList = async (req, res) => {
    const { book_id, author_name, book_name, category, description, image_url, language, page_count, publish_date, publisher } = req.body;
    const userId = req.userId;

    try {
        // Check if the book already exists
        let [rows] = await pool.query('SELECT book_id FROM readinglist WHERE book_id = $1 AND user_id = $2', [book_id, userId]);
        let bookId;

        if (rows.length > 0) {
            res.status(200).json({message: 'Book already exists'});
        } else {
            const [result] = await db.query(
                'INSERT INTO readinglist (book_id, user_id, author_name, book_name, category, description, image_url, language, page_count, publish_date, publisher) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [book_id, userId, author_name, book_name, category, description, image_url, language, page_count, publish_date, publisher]
            );
            bookId = result.insertId;
        }

        res.status(200).json({ message: 'Book added to reading list' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const getReadingList = async (req, res) => {
    const userId = req.userId;
    try {
        const rows = await pool.query(
            'SELECT * FROM readinglist WHERE user_id = $1',
            [userId]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const deleteFromReadingList = async (req, res) => {
    const userId = req.userId;
    const { bookId } = req.params;

    try {
        await pool.query(
            'DELETE FROM readinglist WHERE user_id = $1 AND book_id = $2',
            [userId, bookId]
        );
        res.status(200).json({ message: 'Book deleted from reading list' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};



module.exports = {
    addToReadingList,
    getReadingList,
    deleteFromReadingList,
    // addToWishlist,
    // getWishlist
};
