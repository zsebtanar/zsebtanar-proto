import React, { ReactNode, useContext } from 'react'
import { useOverlayDispatch } from './OverlayProvider'

interface DialogContextAPI {
  closeModal<R>(result?: R): void
}

interface Props {
  id: string
  children: ReactNode
}

///

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DialogContext = React.createContext<DialogContextAPI>({} as any)

export function DialogProvider({ id, children }: Props): JSX.Element {
  const { closeModal } = useOverlayDispatch()

  const api: DialogContextAPI = {
    closeModal<T>(result?: boolean | undefined | T): void {
      closeModal(id, result)
    },
  }

  return <DialogContext.Provider value={api}>{children}</DialogContext.Provider>
}

export function useDialog() {
  const context = useContext(DialogContext)
  if (context === undefined) {
    throw new Error('useDialog must be used within a DialogContext')
  }
  return context
}
