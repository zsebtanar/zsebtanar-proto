import * as express from 'express'

export const route = express.Router()

route.use('/', require('./create').route)
route.use('/', require('./update').route)
