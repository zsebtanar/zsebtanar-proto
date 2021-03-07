import * as express from 'express'

import { route as create } from './create'
import { route as read } from './read'
import { route as update } from './update'
import { route as stateChange } from './stateChange'
import { route as check } from './check/index'

export const route = express.Router()

route.use('/', create)
route.use('/', read)
route.use('/', update)
route.use('/', stateChange)
route.use('/', check)
