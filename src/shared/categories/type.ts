import { BaseModel } from '../generic/types'

export interface ClassificationModel extends BaseModel {
  label: string
  bgColor?: string
  fgColor?: string
  exercises: string[]
}
