import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cookieParser())
app.use(cors({ origin: true }))

app.use('/api/user/', require('./user/index').route)
app.use('/api/exercise/', require('./exercise/index').route)
app.use('/api/feedback/', require('./feedback/index').route)

export default app
