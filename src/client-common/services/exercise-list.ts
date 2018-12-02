import { BaseModel, Service } from './fireStoreBase'

export interface ExerciseList extends BaseModel{
  title: string
  items?: ExerciseListItem[]
  creation?: Date
  modification?: Date
}

export interface ExerciseListItem extends BaseModel{
  exerciseId: string
}


export const exerciseList = new Service<ExerciseList>('exerciseList')