import { BaseModel, Service } from './fireStoreBase'

export interface ExerciseSheet extends BaseModel {
  title: string
  randomOrder: boolean
  numOfListedItems: number
  items?: ExerciseSheetItem[]
  creation?: Date
  modification?: Date
}

export interface ExerciseSheetItem extends BaseModel {
  exerciseId: string
}

export const exerciseSheet = new Service<ExerciseSheet>('exerciseSheet')
export const exerciseSheetItem = id => new Service<ExerciseSheetItem>(`lesson/${id}/items`)
