import * as express from 'express'
import getToken from '../middlewares/firebaseToken'
import requestValidator from '../middlewares/requestValidator'
import { onlyAdmin, onlyUser } from '../utils/authorization'
import { profileUpdateSchema, roleUpdateSchema } from './model'
import userRoleUpdate from './updateRole'
import getAllUser from './getAllUser'
import userProfileUpdate from './updateProfile'

export const route = express.Router()

route.get('/all', [getToken, onlyAdmin], getAllUser)

route.post(
  '/role/:uid',
  [getToken, onlyAdmin, requestValidator({ body: roleUpdateSchema })],
  userRoleUpdate
)

route.post(
  '/profile/:uid',
  [getToken, onlyUser, requestValidator({ body: profileUpdateSchema })],
  userProfileUpdate
)
