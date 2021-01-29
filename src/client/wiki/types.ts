import { BaseModel } from 'shared/generic/types'

export interface WikiPageModel extends BaseModel {
  title: string
  content: string
  creation?: Date
  modification?: Date
}
