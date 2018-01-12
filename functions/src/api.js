import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cookieParser())
app.use(
  cors({
    origin: [/https?:\/\/localhost:\d{4}/, 'https://zsebtanar-proto-76083.firebaseapp.com'],
    methods: ['GET', 'PUT', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
)

app.use('/api/admin/', require('./admin/index').route)
app.use('/api/user/', require('./user/index').route)
app.use('/api/exercise/check', require('./exercise/validate/index').route)
app.use('/api/exercise/getNextHint', require('./exercise/hints/index').route)
app.use('/api/exercise/state', require('./exercise/state/index').route)
app.use('/api/exercise/', require('./exercise/crud/index').route)

export default app
