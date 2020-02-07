import { BaseModel, Service } from './fireStoreBase'
import { MarkdownResources } from 'client/markdown/types'

export interface WikiPageModel extends BaseModel {
  title: string
  content: string
  resources: MarkdownResources
  creation?: Date
  modification?: Date
}

export const wikiPageService = new Service<WikiPageModel>('wikiPage')
