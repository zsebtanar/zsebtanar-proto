import * as express from 'express'

import { route as getAllUsers } from './getAllUser'
import { route as updateRole } from './updateRole'
import { route as updateProfile } from './updateProfile'

export const route = express.Router()

route.use('/', getAllUsers)
route.use('/', updateRole)
route.use('/', updateProfile)
