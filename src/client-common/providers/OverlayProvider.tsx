import React, { ReactNode, Reducer, useReducer, useContext } from 'react'
import { uid } from 'client-common/utils/uuid'

export type ModalResult<T = unknown> = undefined | true | false | T

interface ModalData {
  id: string
  content: ReactNode
  resolve: (res?: ModalResult) => void
}

interface State {
  modals: ModalData[]
}

interface OverlayContextAPI {
  openDialog(content: ReactNode): Promise<ModalResult>
  closeDialog(id: string, result?: ModalResult): void
  openNotification(): void
}

type OverlayActions =
  | { type: 'OpenModal'; payload: ModalData }
  | { type: 'CloseModal'; payload: { id: string } }

interface Props {
  children: ReactNode
}

///

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const OverlayContext = React.createContext<State>({} as any)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const OverlayDispatchContext = React.createContext<OverlayContextAPI>({} as any)

const defaultState: State = {
  modals: []
}

function overlayReducer(state: State, action: OverlayActions): State {
  switch (action.type) {
    case 'OpenModal': {
      return { modals: [...state.modals, action.payload] }
    }
    case 'CloseModal': {
      return { modals: state.modals.filter(m => m.id === action.payload.id) }
    }
  }
}

export function OverlayProvider({ children }: Props) {
  const [state, dispatch] = useReducer<Reducer<State, OverlayActions>>(overlayReducer, defaultState)

  const api: OverlayContextAPI = {
    openDialog(content: ReactNode): Promise<ModalResult> {
      return new Promise<ModalResult>(resolve => {
        dispatch({
          type: 'OpenModal',
          payload: {
            id: uid(),
            content,
            resolve
          }
        })
      })
    },
    closeDialog(id: string, result?: ModalResult): void {
      const modal = state.modals.find(m => m.id === id)
      if (modal) {
        modal.resolve(result)
      }
    },
    openNotification(): void {}
  }

  return (
    <OverlayContext.Provider value={state}>
      <OverlayDispatchContext.Provider value={api}>{children}</OverlayDispatchContext.Provider>
    </OverlayContext.Provider>
  )
}

export function useOverlay() {
  const context = useContext(OverlayContext)
  if (context === undefined) {
    throw new Error('useOverlay must be used within a OverlayContext')
  }
  return context
}

export function useOverlayDispatch() {
  const context = useContext(OverlayDispatchContext)
  if (context === undefined) {
    throw new Error('userOverlayDispatch must be used within a OverlayDispatchContext')
  }
  return context
}
