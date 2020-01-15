import React, { ReactNode, useContext } from 'react'
import { ModalResult, useOverlayDispatch } from './OverlayProvider'

interface DialogContextAPI {
  closeDialog(result?: ModalResult): void
}

interface Props {
  id: string
  children: ReactNode
}

///

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DialogContext = React.createContext<DialogContextAPI>({} as any)

export function DialogProvider({ id, children }: Props) {
  const { closeDialog } = useOverlayDispatch()

  const api: DialogContextAPI = {
    closeDialog<T>(result?: boolean | undefined | T): void {
      closeDialog(id, result)
    }
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
