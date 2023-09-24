import express, {Express} from 'express'
import dotenv from 'dotenv'
import routes from './routes/index.js'
dotenv.config()

const app: Express = express()

app.use(express.json())

// initial route
app.use('/api', routes)

const PORT: number | string = process.env.PORT || 3500

app.listen(PORT, () => console.log(`[server]: Server running at http://localhost:${PORT}`))
