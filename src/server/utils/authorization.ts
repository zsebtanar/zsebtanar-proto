import { curry, pathOr } from 'ramda'
import { ErrorHandler } from '../middlewares/error'

export const ROLE_USER = 0
export const ROLE_TEACHER = 500
export const ROLE_ADMIN = 1000

export const roleCheck = curry((roles, req, res, next) => {
  const userRole = pathOr(ROLE_USER, ['user', 'role'], req)

  if (roles.includes(userRole)) {
    next()
  } else {
    console.warn('forbidden', JSON.stringify(req.user))
    next(new ErrorHandler(403, 'Forbidden'))
  }
})

export const onlyAdmin = roleCheck([ROLE_ADMIN])
export const onlyTeacher = roleCheck([ROLE_TEACHER])
export const onlyEditors = roleCheck([ROLE_ADMIN, ROLE_TEACHER])
export const onlyUser = roleCheck([ROLE_USER])
export const publicEndpoint = roleCheck([ROLE_USER, ROLE_TEACHER, ROLE_ADMIN])
