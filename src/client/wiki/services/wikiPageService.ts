import { Service } from 'client/generic/services'
import { WikiPageModel } from '../types'
import { useFetchData } from 'client/generic/hooks'

export const wikiPageService = new Service<WikiPageModel>('wikiPage')

export function useStoreWikiPage(model: WikiPageModel) {
  return useFetchData<unknown>(() => wikiPageService.store(model), [model])
}

export function useLoadWikiPage(pageId: string) {
  return useFetchData<WikiPageModel>(() => wikiPageService.get(pageId), [pageId])
}

export function useLoadWikiPages() {
  return useFetchData<WikiPageModel[]>(() => wikiPageService.getList(), [])
}
