import { BaseModel } from '../generic/types'

export interface ClassificationModel {
  [key: string]: ClassificationSummaryDoc
}

export interface ClassificationDetailsModel extends BaseModel, ClassificationDetailsDoc {}

export interface ClassificationDetailsDoc {
  exercises: string[]
}

export interface ClassificationSummaryDoc {
  id: string
  label: string
  bgColor?: string
  fgColor?: string
  exerciseCount: number
}
