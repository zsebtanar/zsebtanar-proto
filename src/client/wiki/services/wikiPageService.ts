import { useCallback } from 'react'
import { WikiPageModel } from '../types'
import { LoadAndStoreModelAPI, useLoadAndStoreModel } from '../../generic/hooks/loadAndStoreModel'
import { Service } from '../../generic/services/fireStoreBase'
import { FetchDataAPI, useFetchData } from '../../generic/hooks/fetchData'

export const collectionName = 'wikiPage'

export const wikiPageService = new Service<WikiPageModel>(collectionName)

export function useStoreWikiPage(model: WikiPageModel): FetchDataAPI<unknown> {
  return useFetchData<unknown>(() => wikiPageService.store(model), [model])
}

export function useLoadWikiPage(pageId: string): FetchDataAPI<WikiPageModel> {
  return useFetchData<WikiPageModel>(() => wikiPageService.get(pageId), [pageId])
}

export function useLoadWikiPages(): FetchDataAPI<WikiPageModel[]> {
  return useFetchData<WikiPageModel[]>(() => wikiPageService.getList(), [])
}

export function useWikiPageModel(id: string): LoadAndStoreModelAPI<WikiPageModel> {
  const load = useCallback((id) => wikiPageService.get(id), [])
  const store = useCallback((data) => wikiPageService.store(data).then(() => data), [])
  return useLoadAndStoreModel<WikiPageModel>(load, store, id)
}
