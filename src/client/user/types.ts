import { BaseModel } from '../../shared/generic/types'

export interface UserModel extends BaseModel {}

export enum ProviderTypes {
  Google = 'google',
  Facebook = 'facebook',
}

export interface UserToken {
  role: number
}
