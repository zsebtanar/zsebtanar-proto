import * as express from 'express'

export const route = express.Router()

route.use('/', require('./getAllUser').route)
route.use('/', require('./updateRole').route)
route.use('/', require('./updateProfile').route)
