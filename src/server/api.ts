import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

import { route as user } from './user/index'
import { route as exercise } from './exercise/index'
import { route as feedback } from './feedback/index'
import { route as support } from './support/index'

import { mainErrorHandler } from './middlewares/error'

const app = express()

app.use(cors({ origin: '*' }))
app.use(cookieParser())
app.use(bodyParser.json())

app.use('/api/user/', user)
app.use('/api/exercise/', exercise)
app.use('/api/feedback/', feedback)
app.use('/api/support/', support)

app.use(mainErrorHandler)

export default app
