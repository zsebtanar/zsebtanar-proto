import { BaseModel, Service } from './fireStoreBase'

export enum ExerciseStates {
  Active= 'active',
  Archive = 'archive',
  Draft = 'draft'
}

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

export interface ExerciseModel extends BaseModel {
  type: FeedbackType
  state: FeedbackState
  site: FeedbackSite
  description: string
  email: string
  pathname: string
  created?: Date
  modification?: Date
}

export const FeedbackService = new Service<ExerciseModel>('exercise')

