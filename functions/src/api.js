import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cookieParser())
app.use(cors())

app.use('/api/exercise/check', require('./exercise/validate/index').default)
app.use('/api/exercise/getNextHint', require('./exercise/hints/index').default)
app.use('/api/exercise/state', require('./exercise/state/index').default)
app.use('/api/exercise/', require('./exercise/crud/index').default)

export default app
