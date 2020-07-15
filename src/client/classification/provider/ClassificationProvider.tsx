import React from 'react'
import { useLoadClassifications } from '../services/classificationService'
import { FetchDataAPI } from '../../generic/hooks/fetchData'
import { ClassificationModel } from 'shared/categories/type'
import { list2map } from 'shared/utils/fn'

interface Props {
  children: React.ReactNode
}

interface ValueTypes {
  list: ClassificationModel[]
  map: Record<string, ClassificationModel>
}

type CtxType = FetchDataAPI<ValueTypes>

export const ClassificationContext = React.createContext<CtxType>({} as any)

export function ClassificationProvider({ children }: Props): JSX.Element {
  const state = useLoadClassifications()

  const list = state.result ?? []
  const map = list2map('id', list)
  debugger
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
