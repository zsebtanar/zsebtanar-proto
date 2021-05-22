import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

import { route as user } from './user/index'
import { route as exercise } from './exercise/index'
import { route as feedback } from './feedback/index'
import { route as support } from './support/index'

import { errorHandler } from './middlewares/errorHandler'

const app = express()

app.use(cors({ origin: '*' }))
app.use(cookieParser())
app.use(bodyParser.json())

app.use('/api/user/', user)
app.use('/api/exercise/', exercise)
app.use('/api/feedback/', feedback)
app.use('/api/support/', support)

app.use(errorHandler)

export default app
