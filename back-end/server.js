import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import connectDB from './db/db.js'
import router from './routes/routes.js'
const app = express()
dotenv.config()

const PORT = process.env.PORT || 3000

connectDB()
// Middleware
app.use(express.json())
app.use(cors())
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))



// Auth/user routes (frontend expects /api/auth/* via Vite proxy)
app.use('/api/auth', router)




app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`)
})
