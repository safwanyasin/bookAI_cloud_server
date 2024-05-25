const pool = require('../config');

const addStory = async (req, res) => {
    const { story_id, title, content } = req.body;
    const userId = req.userId;

    try {
        // Check if the book already exists
        let [rows] = await pool.query('SELECT story_id FROM generatedstories WHERE story_id = $1 AND user_id = $2', [story_id, userId]);
        let storyId;

        if (rows.length > 0) {
            res.status(200).json({message: 'Story already exists'});
        } else {
            const [result] = await db.query(
                'INSERT INTO generatedstories (story_id, user_id, title, content) VALUES (?, ?, ?, ?)',
                [story_id, userId, title, content],
            );
            storyId = result.insertId;
        }

        res.status(200).json({ message: 'Story added successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const getStories = async (req, res) => {
    const userId = req.userId;
    try {
        const rows = await pool.query(
            'SELECT * FROM generatedstories WHERE user_id = $1',
            [userId]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const deleteStory = async (req, res) => {
    const userId = req.userId;
    const { storyId } = req.params;

    try {
        await pool.query(
            'DELETE FROM generatedstories WHERE user_id = $1 AND story_id = $2',
            [userId, storyId]
        );
        res.status(200).json({ message: 'Story deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};



module.exports = {
    addStory,
    deleteStory,
    getStories,
    // addToWishlist,
    // getWishlist
};
