import { Router, Response, Request } from 'express'
import pool from '../config/db.js'

const router = Router()

type Student = {
  full_name: string
  course_number: number
  faculty: string
}

// get all students
router.get('/', async (req: Request, res: Response) => {
  try {
    const students = await pool.query(`SELECT * FROM students ORDER BY id`)
    res.status(200).json(students.rows)
  } catch (error) {
    res.status(500).json({ error })
  }
})

// get one student by id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const student = await pool.query(`SELECT * FROM students WHERE id = $1`, [id])
    
    if (student.rows.length > 0) return res.status(200).json(student.rows[0])
    res.status(404).json({ message: 'Student not found' })
  } catch (error) {
    res.status(500).json({ error })
  }
})

// create student
router.post('/add', async (req: Request, res: Response) => {
  try {
    const { full_name, course_number, faculty }: Student = req.body
    const createdStudent = await pool.query(
      `INSERT INTO students (full_name, course_number, faculty)
        VALUES ($1, $2, $3) RETURNING *`,
      [full_name, course_number, faculty],
    )

    res.status(201).json(createdStudent.rows[0])
  } catch (error) {
    res.status(500).json({ error })
  }
})

// update student
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { full_name, course_number, faculty }: Student = req.body
    const oldSudent = await pool.query(`SELECT * FROM students WHERE id = $1`, [id])
    const updatedStudent = await pool.query(
      `UPDATE students
       SET full_name = $1, course_number = $2, faculty = $3 
       WHERE id = $4 RETURNING *`,
      [
        full_name ?? oldSudent.rows[0].full_name,
        course_number ?? oldSudent.rows[0].course_number,
        faculty ?? oldSudent.rows[0].faculty,
        id,
      ],
    )

    res.status(200).json(updatedStudent.rows[0])
  } catch (error) {
    res.status(500).json({ error })
  }
})

// delete student
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await pool.query(`DELETE FROM students WHERE id = $1`, [id])
    res.status(200).json({ message: 'Student successfully deleted' })
  } catch (error) {
    res.status(500).json({ error })
  }
})

export default router
