import React from 'react'
import { useLoadClassifications } from '../services/classificationService'
import { FetchDataAPI } from '../../generic/hooks/fetchData'
import { ClassificationSummaryDoc } from 'shared/classification/type'
import { sortByProp, map2list, list2map } from 'shared/utils/fn'

interface Props {
  children: React.ReactNode
}

interface ValueTypes {
  list: ClassificationSummaryDoc[]
  map: Record<string, ClassificationSummaryDoc>
}

type CtxType = FetchDataAPI<ValueTypes>

export const ClassificationContext = React.createContext<CtxType>({} as any)

export function ClassificationProvider({ children }: Props): JSX.Element {
  const state = useLoadClassifications()

  const result = state.result ?? {}
  const list = map2list(result, 'id').sort(sortByProp('id'))
  const map = list2map('id', list) as ValueTypes['map']
  const value = { ...state, result: { list, map } }

  return <ClassificationContext.Provider value={value}>{children}</ClassificationContext.Provider>
}

export function useClassification(): CtxType {
  const context = React.useContext(ClassificationContext)
  if (context === undefined) {
    throw new Error('useClassification must be used within a ClassificationContext')
  }
  return context
}
