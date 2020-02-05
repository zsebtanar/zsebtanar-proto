import { BaseModel } from 'client/generic/services'
import { MarkdownResources } from 'client/markdown/types'

export interface WikiPageModel extends BaseModel {
  title: string
  content: string
  resources: MarkdownResources
  creation?: Date
  modification?: Date
}
