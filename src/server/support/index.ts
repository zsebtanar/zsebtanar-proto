import * as express from 'express'

import { route as reIndexSearch } from './reIndexSearch'

export const route = express.Router()

route.use('/', reIndexSearch)
