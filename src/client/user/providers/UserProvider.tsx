import React, { ReactNode, Reducer, useReducer } from 'react'
import { app } from 'client/generic/services'
import { logException } from 'client/generic/utils/logger'
import { parseToken, getUserDetails } from 'client/user/services/user'
import { UserModel } from '../types'

interface Props {
  children: ReactNode
}

interface State {
  loading: boolean
  loggedIn: boolean
  error?: Error
  user?: firebase.User
  userToken?: string
  userDetails?: UserModel
}

interface UserContextAPI {
  signIn(email: string, password: string): Promise<State>
  signUp(email: string, password: string, displayName: string): Promise<State>
  signOut(): void
}

type Action =
  | { type: 'SetUser'; payload: { user?: firebase.User } }
  | { type: 'SetDetails'; payload: { details: UserModel; token: string } }
  | { type: 'SingInStart' }
  | { type: 'NoUser' }
  | { type: 'Error'; payload: Error }

const AUTH = app.auth()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UserContext = React.createContext<State>({} as any)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UserDispatchContext = React.createContext<UserContextAPI>({} as any)

const defaultState: State = {
  loading: true,
  loggedIn: false,
  error: undefined,
  user: undefined,
  userToken: undefined,
  userDetails: undefined
}

function userReducer(state: State, action: Action) {
  switch (action.type) {
    case 'SetUser': {
      const { user } = action.payload
      return { ...state, user: user, loggedIn: !!user }
    }
    case 'SetDetails': {
      const { details, token } = action.payload
      return { ...state, loading: false, userDetails: details, userToken: token }
    }
    case 'SingInStart': {
      return { ...defaultState }
    }
    case 'NoUser': {
      return { ...defaultState, loading: false }
    }
    case 'Error': {
      return { ...defaultState, loading: false, error: action.payload }
    }
  }
}

export function UserProvider({ children }: Props) {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(userReducer, defaultState)

  React.useEffect(() => {
    AUTH.onAuthStateChanged(async user => {
      try {
        if (user) {
          dispatch({ type: 'SetUser', payload: { user } })
          const [details, token] = await Promise.all([
            getUserDetails(user.uid).catch(() => ({})),
            parseToken(user)
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
    if (state.error) {
      logException(state.error)
    }
  })

  const api: UserContextAPI = {
    async signIn(email: string, password: string): Promise<State> {
      dispatch({ type: 'SingInStart' })
      try {
        await AUTH.signInWithEmailAndPassword(email, password)
      } catch (e) {
        dispatch({ type: 'Error', payload: e })
      }
      return state
    },
    async signUp(email: string, password: string): Promise<State> {
      // dispatch({ type: SIGN_UP_START })
      // const user = await AUTH.createUserWithEmailAndPassword(email, password)
      //   .then(user => updateUserProfile(user.user.uid, { displayName }))
      //   .then(res => dispatch({ type: USER_SIGN_UP_FINISHED, payload: { user: res.data } }))
      //   .catch(handleError(SIGN_UP_ERROR, dispatch))
      return state
    },
    async signOut(): Promise<void> {
      try {
        await AUTH.signOut()
        dispatch({ type: 'NoUser' })
        window.location.replace('/')
      } catch (e) {
        dispatch({ type: 'Error', payload: e })
      }
    }
  }

  return (
    <UserContext.Provider value={state}>
      <UserDispatchContext.Provider value={api}>{children}</UserDispatchContext.Provider>
    </UserContext.Provider>
  )
}

export function useUser() {
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
//
// export function signUp(email, password, { displayName }): any {
//   return dispatch => {
//     dispatch({ type: SIGN_UP_START })
//     return AUTH.createUserWithEmailAndPassword(email, password)
//       .then(user => updateUserProfile(user.user.uid, { displayName }))
//       .then(res => dispatch({ type: USER_SIGN_UP_FINISHED, payload: { user: res.data } }))
//       .catch(handleError(SIGN_UP_ERROR, dispatch))
//   }
// }
//
// export function signIn(email, password): any {
//   return dispatch => {
//
//   }
// }
//
// export function forgotPassword(email: string): Promise<any> {
//   return AUTH.sendPasswordResetEmail(email, { url: window.location.href })
// }
//
// export function googleSignIn(): any {
//   return dispatch => {
//     dispatch({ type: SSO_SIGN_IN_START })
//     const provider = new firebase.auth.GoogleAuthProvider()
//     provider.addScope('email')
//     provider.addScope('profile')
//     return AUTH.signInWithPopup(provider).catch(handleError(SSO_SIGN_IN_ERROR, dispatch))
//   }
// }
//
// export function facebookSignIn(): any {
//   return dispatch => {
//     dispatch({ type: SSO_SIGN_IN_START })
//     const provider = new firebase.auth.FacebookAuthProvider()
//     provider.addScope('email')
//     provider.addScope('public_profile')
//     return AUTH.signInWithPopup(provider).catch(handleError(SSO_SIGN_IN_ERROR, dispatch))
//   }
// }
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
