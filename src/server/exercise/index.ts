import * as express from 'express'

import { route as create } from './create'
import { route as update } from './update'
import { route as stateChange } from './stateChange'

export const route = express.Router()

route.use('/', create)
route.use('/', update)
route.use('/', stateChange)
