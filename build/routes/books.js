import { Router } from 'express';
import pool from '../config/db.js';
const router = Router();
router.get('/', async (req, res) => {
    try {
        const books = await pool.query(`SELECT * FROM books ORDER BY id`);
        res.status(200).json(books.rows);
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const books = await pool.query(`SELECT * FROM books WHERE id = $1`, [id]);
        if (books.rows.length > 0)
            return res.status(200).json(books.rows[0]);
        res.status(404).json({ message: 'Not found' });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
router.post('/add', async (req, res) => {
    try {
        const { book_name, author } = req.body;
        const newBook = await pool.query(`INSERT INTO books (book_name, author)
       VALUES ($1, $2) RETURNING *`, [book_name, author]);
        res.status(200).json(newBook.rows[0]);
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const { book_name, author } = req.body;
        const { id } = req.params;
        const oldBook = await pool.query(`SELECT * FROM books WHERE id = $1`, [id]);
        const updatedBook = await pool.query(`UPDATE books
      SET book_name = $1, author = $2
      WHERE id = $3 RETURNING *`, [book_name !== null && book_name !== void 0 ? book_name : oldBook.rows[0].book_name, author !== null && author !== void 0 ? author : oldBook.rows[0].author, id]);
        res.status(200).json(updatedBook.rows[0]);
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query(`DELETE FROM books WHERE id = $1`, [id]);
        res.status(200).json({ message: 'Book succesfully deleted' });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
export default router;
//# sourceMappingURL=books.js.map