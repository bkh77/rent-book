import { Router } from 'express';
import pool from '../config/db.js';
const router = Router();
router.get('/', async (req, res) => {
    try {
        const rents = await pool.query(`SELECT * FROM rent ORDER BY id`);
        res.status(200).json(rents.rows);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const rent = await pool.query(`SELECT * FROM rent WHERE id = $1`, [id]);
        if (rent.rows.length > 0)
            return res.status(200).json(rent.rows);
        res.status(404).json({ message: 'Rent not found' });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
router.post('/add', async (req, res) => {
    try {
        const { book_id, student_id, rent_date, deadline } = req.body;
        const createdRent = await pool.query(`INSERT INTO rent (book_id, student_id, rent_date, deadline)
       VALUES ($1, $2, $3, $4) RETURNING *`, [book_id, student_id, rent_date, deadline]);
        res.status(200).json(createdRent.rows[0]);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { book_id, student_id, rent_date, deadline } = req.body;
        const oldRent = await pool.query(`SELECT * FROM rent WHERE id = $1`, [id]);
        const updatedRent = await pool.query(`UPDATE rent 
      SET book_id = $1, student_id = $2, rent_date = $3, deadline = $4
      WHERE id = $5 RETURNING *`, [
            book_id !== null && book_id !== void 0 ? book_id : oldRent.rows[0].book_id,
            student_id !== null && student_id !== void 0 ? student_id : oldRent.rows[0].student_id,
            rent_date !== null && rent_date !== void 0 ? rent_date : oldRent.rows[0].rent_date,
            deadline !== null && deadline !== void 0 ? deadline : oldRent.rows[0].deadline,
            id,
        ]);
        res.status(200).json(updatedRent.rows[0]);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query(`DELETE FROM rent WHERE id = $1`, [id]);
        res.status(200).json({ message: 'rent deleted successfully' });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
export default router;
//# sourceMappingURL=rents.js.map