import React, { ReactNode, Reducer, useReducer, useMemo } from 'react'
import { logException } from 'client/generic/utils/logger'
import { parseToken, getUserDetails, updateUserProfile } from 'client/user/services/user'
import { UserModel, ProviderTypes, UserToken } from '../types'
import { firebase, app } from '../../generic/services/fireApp'

interface Props {
  children: ReactNode
}

enum UserStates {
  Idle = 'idle',
  Loading = 'loading',
  Error = 'error',
  RegisterUser = 'registerUser',
}

interface Store {
  state: UserStates
  loggedIn: boolean
  error?: Error
  user?: firebase.User
  userToken?: UserToken
  userDetails?: UserModel
  isLoading: boolean
  isRegistration: boolean
  hasError: boolean
}

interface UserContextAPI {
  signIn(email: string, password: string): Promise<Store>
  ssoSignIn(providerType: ProviderTypes): Promise<Store>
  signUp(email: string, password: string, displayName: string): Promise<Store>
  forgotPassword(email: string): Promise<unknown>
  signOut(): void
}

type Action =
  | { type: 'SetUser'; payload: { user?: firebase.User } }
  | { type: 'SetDetails'; payload: { details: UserModel; token: UserToken } }
  | { type: 'LoadUser' }
  | { type: 'SingInStart' }
  | { type: 'SSOSignInStart' }
  | { type: 'SingUpStart' }
  | { type: 'SingUpDone' }
  | { type: 'NoUser' }
  | { type: 'Error'; payload: Error }

const AUTH = app.auth()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UserContext = React.createContext<Store>({} as any)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UserDispatchContext = React.createContext<UserContextAPI>({} as any)

const defaultState: Store = {
  state: UserStates.Idle,
  loggedIn: false,
  error: undefined,
  user: undefined,
  userToken: undefined,
  userDetails: undefined,
  isLoading: false,
  hasError: false,
  isRegistration: false,
}

function updateState(state: UserStates) {
  return {
    state,
    isLoading: state === UserStates.Loading,
    isRegistration: state === UserStates.RegisterUser,
    hasError: state === UserStates.Error,
  }
}

function userReducer(state: Store, action: Action): Store {
  switch (action.type) {
    case 'SetUser': {
      const { user } = action.payload
      return { ...state, user: user, loggedIn: !!user, ...updateState(UserStates.Idle) }
    }
    case 'SetDetails': {
      const { details, token } = action.payload
      return { ...state, userDetails: details, userToken: token }
    }
    case 'SingUpStart':
      return { ...defaultState, ...updateState(UserStates.RegisterUser) }
    case 'LoadUser':
    case 'SingInStart': {
      return { ...defaultState, ...updateState(UserStates.Loading) }
    }
    case 'NoUser': {
      return { ...defaultState, ...updateState(UserStates.Idle) }
    }
    case 'Error': {
      return { ...defaultState, error: action.payload, ...updateState(UserStates.Error) }
    }
    default:
      return state
  }
}

export function UserProvider({ children }: Props): JSX.Element {
  const [store, dispatch] = useReducer<Reducer<Store, Action>>(userReducer, defaultState)

  React.useEffect(() => {
    AUTH.onAuthStateChanged(async (user) => {
      dispatch({ type: 'LoadUser' })

      try {
        if (store.state === UserStates.RegisterUser) return
        if (user) {
          dispatch({ type: 'SetUser', payload: { user } })
          const [details, token] = await Promise.all([
            getUserDetails(user.uid).catch(() => ({})),
            parseToken(user),
          ])
          dispatch({ type: 'SetDetails', payload: { details, token } })
        } else {
          dispatch({ type: 'NoUser' })
        }
      } catch (e) {
        dispatch({ type: 'Error', payload: e })
      }
    })
  }, [])

  React.useEffect(() => {
    if (store.error) {
      logException(store.error)
    }
  })

  const api: UserContextAPI = useMemo(
    () => ({
      async signIn(email: string, password: string): Promise<Store> {
        dispatch({ type: 'SingInStart' })
        try {
          await AUTH.signInWithEmailAndPassword(email, password)
        } catch (e) {
          dispatch({ type: 'Error', payload: e })
        }
        return store
      },
      async ssoSignIn(providerType: ProviderTypes) {
        try {
          dispatch({ type: 'SSOSignInStart' })
          let provider
          if (providerType === ProviderTypes.Google) {
            provider = new firebase.auth.GoogleAuthProvider()
            provider.addScope('email')
            provider.addScope('profile')
          } else if (providerType === ProviderTypes.Facebook) {
            provider = new firebase.auth.FacebookAuthProvider()
            provider.addScope('email')
            provider.addScope('public_profile')
          }
          if (!provider) {
            throw new Error(`Invalid provider: ${providerType}`)
          }
          await AUTH.signInWithPopup(provider)
        } catch (e) {
          dispatch({ type: 'Error', payload: e })
          return Promise.reject(e)
        }

        return store
      },
      async signUp(email: string, password: string, displayName: string): Promise<Store> {
        try {
          dispatch({ type: 'SingUpStart' })
          const userCredential = await AUTH.createUserWithEmailAndPassword(email, password)
          if (!(userCredential && userCredential.user)) {
            throw new Error('Create user failed')
          }
          dispatch({ type: 'SetUser', payload: { user: userCredential.user } })
          const [details, token] = await Promise.all([
            getUserDetails(userCredential.user.uid).catch(() => ({})),
            parseToken(userCredential.user),
            updateUserProfile(userCredential.user.uid, { displayName }),
          ])
          dispatch({ type: 'SetDetails', payload: { details, token } })
        } catch (e) {
          dispatch({ type: 'Error', payload: e })
          return Promise.reject(e)
        }

        return store
      },
      async signOut(): Promise<void> {
        try {
          await AUTH.signOut()
          dispatch({ type: 'NoUser' })
          window.location.replace('/')
        } catch (e) {
          dispatch({ type: 'Error', payload: e })
        }
      },
      forgotPassword(email: string) {
        return AUTH.sendPasswordResetEmail(email, {
          url: window.location.href.replace('/forgotten-password', '') + '/login',
        })
      },
    }),
    [store],
  )

  return (
    <UserContext.Provider value={store}>
      <UserDispatchContext.Provider value={api}>{children}</UserDispatchContext.Provider>
    </UserContext.Provider>
  )
}

export function useUserState() {
  const context = React.useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserContext')
  }
  return context
}

export function useUserDispatch() {
  const context = React.useContext(UserDispatchContext)
  if (context === undefined) {
    throw new Error('useUserDispatch must be used within a UserDispatchContext')
  }
  return context
}

export function useUser() {
  const user = useUserState()
  const dispatch = useUserDispatch()
  return { ...user, ...dispatch }
}

// export function forgotPassword(email: string): Promise<any> {
//   return AUTH.sendPasswordResetEmail(email, { url: window.location.href })
// }
//

//
// export function deleteUser() {
//   return () =>
//     Promise.all([AUTH.currentUser.delete(), removeUserData(AUTH.currentUser.uid)])
//       .then(() => window.location.replace('/'))
//       .catch(logException)
// }
//
// const handleError = (type, dispatch) => error => {
//   logException(error)
//   dispatch({ type, payload: error, error: true })
// }
