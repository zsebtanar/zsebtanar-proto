import { Service } from 'client/generic/services'
import { WikiPageModel } from '../types'
import { useDataLoad } from 'client/generic/hooks'

export const wikiPageService = new Service<WikiPageModel>('wikiPage')

export function useLoadWikiPage(pageId: string) {
  return useDataLoad<WikiPageModel>(() => wikiPageService.get(pageId), [pageId])
}

export function useLoadWikiPages() {
  return useDataLoad<WikiPageModel[]>(() => wikiPageService.getList(), [])
}
