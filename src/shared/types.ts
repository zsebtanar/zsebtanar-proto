export type FormMode = 'new' | 'update' | 'clone'

export interface UserData {
  uid: string
  disabled: boolean
  email: string
  emailVerified: boolean
  metadata: unknown
  providerData: string
  displayName: string
  customClaim: {
    role: number
  }
}
