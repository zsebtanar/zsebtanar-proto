import { curry } from 'ramda'
import { HandlerError } from './HandlerError'
import { logger } from 'firebase-functions'

export const ROLE_USER = 0
export const ROLE_TEACHER = 500
export const ROLE_ADMIN = 1000

export const roleCheck = curry((roles, req, res, next) => {
  const userRole = req?.user?.role ?? ROLE_USER

  if (roles.includes(userRole)) {
    next()
  } else {
    logger.warn('forbidden', JSON.stringify(req.user))
    next(new HandlerError(403, 'Forbidden'))
  }
})

export const onlyAdmin = roleCheck([ROLE_ADMIN])
export const onlyTeacher = roleCheck([ROLE_TEACHER])
export const onlyEditors = roleCheck([ROLE_ADMIN, ROLE_TEACHER])
export const onlyUser = roleCheck([ROLE_USER])
export const publicEndpoint = roleCheck([ROLE_USER, ROLE_TEACHER, ROLE_ADMIN])
