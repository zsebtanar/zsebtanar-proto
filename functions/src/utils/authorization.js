import { curry, pathOr } from 'ramda'

export const ROLE_USER = 0
export const ROLE_TEACHER = 500
export const ROLE_ADMIN = 1000

export const roleCheck = curry((roles, handler, req, res) => {
  const userRole = pathOr(ROLE_USER, ['user', 'details', 'role'], req)

  if (roles.includes(userRole)) {
    handler(req, res)
  } else {
    console.warn('forbidden', JSON.stringify(req.user))
    res.status(403).send('Forbidden')
  }
})

export const onlyAdmin = roleCheck([ROLE_ADMIN])
export const onlyTeacher = roleCheck([ROLE_TEACHER])
export const onlyEditors = roleCheck([ROLE_ADMIN, ROLE_TEACHER])
export const onlyUser = roleCheck([ROLE_USER])
export const publicEndpoint = roleCheck([ROLE_USER, ROLE_TEACHER, ROLE_ADMIN])
