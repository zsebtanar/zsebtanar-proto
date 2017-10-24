import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cookieParser())
app.use(cors())

app.use('/api/exercise/check', require('./exercise/validate').default)
app.use('/api/exercise/getNextHint', require('./exercise/getNextHint').default)
app.use('/api/exercise/', require('./exercise/manageExercise').default)

export default app
