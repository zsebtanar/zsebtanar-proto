import { BaseModel } from '../generic/types'

export interface ClassificationDetailsModel extends BaseModel, ClassificationDetailsDoc {}

export interface ClassificationDetailsDoc {
  exercises: string[]
}

export interface ClassificationSummaryDoc {
  [key: string]: ClassificationSummaryDocItem
}

export interface ClassificationSummaryDocItem {
  id: string
  label: string
  bgColor?: string
  fgColor?: string
  exerciseCount: number
}
