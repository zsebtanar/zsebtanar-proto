import React from 'react'
import { useLoadClassifications } from '../services/classificationService'

interface Props {
  children: React.ReactNode
}

type CtxType = ReturnType<typeof useLoadClassifications>

export const ClassificationContext = React.createContext<CtxType>({} as any)

export function ClassificationProvider({ children }: Props): JSX.Element {
  const state = useLoadClassifications()
  return <ClassificationContext.Provider value={state}>{children}</ClassificationContext.Provider>
}

export function useClassification(): CtxType {
  const context = React.useContext(ClassificationContext)
  if (context === undefined) {
    throw new Error('useClassification must be used within a ClassificationContext')
  }
  return context
}
