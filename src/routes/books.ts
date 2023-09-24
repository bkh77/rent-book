import { Router, Request, Response } from 'express'
import pool from '../config/db.js'

const router = Router()

// get all books
router.get('/', async (req: Request, res: Response) => {
  try {
    const books = await pool.query(`SELECT * FROM books ORDER BY id`)
    res.status(200).json(books.rows)
  } catch (error) {
    res.status(500).json({ error })
  }
})

// get one book by id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const books = await pool.query(`SELECT * FROM books WHERE id = $1`, [id])
    
    if (books.rows.length > 0) return res.status(200).json(books.rows[0])
    res.status(404).json({ message: 'Not found' })
  } catch (error) {
    res.status(500).json({ error })
  }
})

// add book
router.post('/add', async (req: Request, res: Response) => {
  try {
    const { book_name, author } = req.body
    const newBook = await pool.query(
      `INSERT INTO books (book_name, author)
       VALUES ($1, $2) RETURNING *`,
      [book_name, author],
    )

    res.status(200).json(newBook.rows[0])
  } catch (error) {
    res.status(500).json({ error })
  }
})

// update book by id
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { book_name, author } = req.body
    const { id } = req.params
    const oldBook = await pool.query(`SELECT * FROM books WHERE id = $1`, [id])
    const updatedBook = await pool.query(
      `UPDATE books
      SET book_name = $1, author = $2
      WHERE id = $3 RETURNING *`,
      [book_name ?? oldBook.rows[0].book_name, author ?? oldBook.rows[0].author, id],
    )

    res.status(200).json(updatedBook.rows[0])
  } catch (error) {
    res.status(500).json({ error })
  }
})

// delete book by id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await pool.query(`DELETE FROM books WHERE id = $1`, [id])

    res.status(200).json({ message: 'Book succesfully deleted' })
  } catch (error) {
    res.status(500).json({ error })
  }
})

export default router
