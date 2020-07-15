import * as express from 'express'

import { route as reIndexSearch } from './remove'

export const route = express.Router()

route.use('/', reIndexSearch)
