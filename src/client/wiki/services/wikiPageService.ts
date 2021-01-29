import { useCallback } from 'react'
import { WikiPageModel } from '../types'
import { useLoadAndStoreModel } from '../../generic/hooks/loadAndStoreModel'
import { Service } from '../../generic/services/fireStoreBase'
import { useFetchData } from '../../generic/hooks/fetchData'

export const collectionName = 'wikiPage'

export const wikiPageService = new Service<WikiPageModel>(collectionName)

export function useStoreWikiPage(model: WikiPageModel) {
  return useFetchData<unknown>(() => wikiPageService.store(model), [model])
}

export function useLoadWikiPage(pageId: string) {
  return useFetchData<WikiPageModel>(() => wikiPageService.get(pageId), [pageId])
}

export function useLoadWikiPages() {
  return useFetchData<WikiPageModel[]>(() => wikiPageService.getList(), [])
}

export function useWikiPageModel(id: string) {
  const load = useCallback((id) => wikiPageService.get(id), [])
  const store = useCallback((data) => wikiPageService.store(data).then(() => data), [])
  return useLoadAndStoreModel<WikiPageModel>(load, store, id)
}
