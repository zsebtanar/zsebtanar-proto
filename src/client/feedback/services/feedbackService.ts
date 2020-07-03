import { BaseModel } from 'shared/generic/types'
import { Service } from 'client/generic/services/fireStoreBase'
import { cloudFnPost } from 'client/generic/services/firebase'

export enum FeedbackType {
  note = 'note',
  error = 'error',
}

export enum FeedbackState {
  new = 'new',
}

export enum FeedbackSite {
  public = 'public',
  admin = 'admin',
}

export interface FeedbackDataModel extends BaseModel {
  type: FeedbackType
  state?: FeedbackState
  site: FeedbackSite
  description: string
  email: string
  pathname: string
  created?: Date
  modification?: Date
  'g-recaptcha-response': string
}

export const FeedbackService = new Service<FeedbackDataModel>('feedback')

export const createFeedback = (data: FeedbackDataModel) => cloudFnPost('feedback', data)
