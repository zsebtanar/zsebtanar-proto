import { AxiosResponse } from 'axios'
import { cloudFnGet, cloudFnPost } from './utils/firebase'
import { app } from '../fireApp'

const DB = app.database()

const Users = DB.ref('users')

export const ROLE_USER = 0
export const ROLE_TEACHER = 500
export const ROLE_ADMIN = 1000

export const roleIs = (roles, token) => roles.indexOf(token && token.role) > -1

export const isUser = token => roleIs([ROLE_USER], token)
export const isAdmin = token => roleIs([ROLE_ADMIN], token)
export const isTeacher = token => roleIs([ROLE_TEACHER], token)

export async function parseToken(currentUser, force = false) {
  const idToken = await currentUser.getIdToken(force)
  return await JSON.parse(atob(idToken.split('.')[1]))
}

export function getUserDetails(uid) {
  return Users.child(uid)
    .once('value')
    .then(s => s.val())
}

export const removeUserData = uid => Users.child(uid).remove()

export const getAllUser = () =>
  cloudFnGet(`user/all`, {}, { withToken: true }) as Promise<
    AxiosResponse<{ users: FB.UserData[] }>
  >

export const updateUserRole = (uid, newRole) =>
  cloudFnPost(`user/role/${uid}`, { newRole }, { withToken: true })

export const updateUserProfile = (uid, data) =>
  cloudFnPost(`user/profile/${uid}`, data, { withToken: true })
