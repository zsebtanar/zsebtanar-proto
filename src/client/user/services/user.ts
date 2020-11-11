import { UserModel, UserToken } from '../types'
import { cloudFnGet, cloudFnPost } from 'client/generic/services/firebase'
import { Service } from 'client/generic/services/fireStoreBase'
import type firebase from 'firebase'

export const ROLE_USER = 0
export const ROLE_TEACHER = 500
export const ROLE_ADMIN = 1000

export const usersService = new Service<UserModel>('users')

export const roleIs = (roles: number[], token?: UserToken): boolean =>
  !!token && (roles?.includes(token.role) ?? false)

export const isUser = (token?: UserToken): boolean => roleIs([ROLE_USER], token)
export const isAdmin = (token?: UserToken): boolean => roleIs([ROLE_ADMIN], token)
export const isTeacher = (token?: UserToken): boolean => roleIs([ROLE_TEACHER], token)

export async function parseToken(currentUser: firebase.User, force = false): Promise<UserToken> {
  const idToken = await currentUser.getIdToken(force)
  return await JSON.parse(atob(idToken.split('.')[1]))
}

export function getUserDetails(uid: string): Promise<UserModel> {
  return usersService.get(uid)
}

export const removeUserData = (uid: string): Promise<void> => usersService.delete(uid)

export const getAllUser = (): Promise<{ users: FB.UserData[] }> =>
  cloudFnGet(`/user/all`, {}, { withToken: true })

export const updateUserRole = (uid: string, newRole: number): Promise<void> =>
  cloudFnPost(`/user/role/${uid}`, { newRole }, { withToken: true })

export const updateUserProfile = (
  uid: string,
  data: Pick<firebase.UserInfo, 'displayName'>,
): Promise<Pick<firebase.UserInfo, 'displayName'>> =>
  cloudFnPost(`/user/profile/${uid}`, data, { withToken: true })
