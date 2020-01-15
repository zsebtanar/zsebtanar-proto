import { cloudFnPost } from './utils/firebase'
import { BaseModel, Service } from './utils/fireStoreBase'

export enum FeedbackType {
  note = 'note',
  error = 'error'
}

export enum FeedbackState {
  new = 'new'
}

export enum FeedbackSite {
  public = 'public',
  admin = 'admin'
}

export interface FeedbackDataModel extends BaseModel {
  type: FeedbackType
  state: FeedbackState
  site: FeedbackSite
  description: string
  email: string
  pathname: string
  created?: Date
  modification?: Date
}

export const FeedbackService = new Service<FeedbackDataModel>('feedback')

export const createFeedback = data => cloudFnPost('feedback', data)
