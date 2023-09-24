import { Router } from 'express'
import books from './books.js'
import students from './students.js'
import rents from './rents.js'

const router = Router()

router.use('/books', books)
router.use('/students', students)
router.use('/rents', rents)

export default router
