import * as express from 'express'

import { route as create } from './create'
import { route as update } from './update'

export const route = express.Router()

route.use('/', create.route)
route.use('/', update.route)
