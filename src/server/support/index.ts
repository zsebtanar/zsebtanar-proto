import * as express from 'express'

import { route as reIndexSearch } from './reIndexSearch'
import { route as syncExercises } from './syncExercises'

export const route = express.Router()

route.use('/', reIndexSearch)
route.use('/', syncExercises)
