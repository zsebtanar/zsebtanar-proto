import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

const app = express()

app.use(cookieParser())
app.use(bodyParser.json())
app.use(cors({ origin: true }))

app.use('/api/user/', require('./user/index').route)
app.use('/api/exercise/', require('./exercise/index').route)
app.use('/api/feedback/', require('./feedback/index').route)

app.use(require('./middlewares/error').mainErrorHandler)

export default app
