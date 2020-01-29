import { BaseModel } from 'client/generic/services'

export interface WikiPageModel extends BaseModel {
  title: string
  content: string
  resources: MarkdownResources
  creation?: Date
  modification?: Date
}
