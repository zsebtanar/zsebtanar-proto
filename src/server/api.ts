import * as express from 'express'
import * as cors from 'cors'
import * as cookieParser from 'cookie-parser'

const app = express()

app.use(cookieParser())
app.use(cors({ origin: true }))

app.use('/api/admin/', require('./admin/index').route)
app.use('/api/user/', require('./user/index').route)
app.use('/api/exercise/check', require('./exercise/validate/index').route)
app.use('/api/exercise/getNextHint', require('./exercise/hints/index').route)
app.use('/api/exercise/state', require('./exercise/state/index').route)
app.use('/api/exercise/', require('./exercise/crud/index').route)
app.use('/api/feedback/', require('./feedback/index').route)
app.use('/api/userStatistic/', require('./user-statistic/index').route)

export default app
