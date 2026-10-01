import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './db/db.js'
import router from './routes/routes.js'
const app = express()
dotenv.config()
app.set('trust proxy', 1)

const PORT = process.env.PORT || 3000
const API_BASE_PATH = new URL(process.env.BASE_URL || `http://localhost:${PORT}/api`).pathname.replace(/\/$/, '')
const uploadsPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'uploads')

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static(uploadsPath))



// Auth/user routes (frontend expects /api/auth/* via Vite proxy)
app.use(`${API_BASE_PATH}/auth`, router)




const startServer = async () => {
    await connectDB()
    app.listen(PORT, () => {
        console.log(`app is running on port ${PORT}`)
    })
}

startServer().catch((error) => {
    console.error('Server startup failed:', error)
    process.exit(1)
})
