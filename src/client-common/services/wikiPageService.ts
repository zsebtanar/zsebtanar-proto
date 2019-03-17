import { BaseModel, Service } from './fireStoreBase'

export interface WikiPageModel extends BaseModel {
  title: string
  content: string
  resources: MarkdownResources
  creation?: Date
  modification?: Date
}

export const wikiPageService = new Service<WikiPageModel>('wikiPage')
