import React, { ReactNode, Reducer, useReducer, useContext } from 'react'
import * as cx from 'classnames'
import { uid } from '../../generic/utils'
import { DialogProvider, useDialog } from './DialogProvider'
import { DialogData } from 'client/overlay/types'

interface State {
  modals: DialogData[]
}

interface OverlayContextAPI {
  openModal<R = unknown>(content: ReactNode): Promise<R>
  closeModal<R = unknown>(id: string, result?: R): void
  openNotification(): void
}

type OverlayActions =
  | { type: 'OpenModal'; payload: DialogData }
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
      return { modals: state.modals.filter(m => m.id !== action.payload.id) }
    }
  }
}

export function OverlayProvider({ children }: Props) {
  const [state, dispatch] = useReducer<Reducer<State, OverlayActions>>(overlayReducer, defaultState)

  const api: OverlayContextAPI = {
    openModal<R>(content: ReactNode, disableBackdropClose = false): Promise<R> {
      return new Promise<R>(resolve => {
        dispatch({
          type: 'OpenModal',
          payload: {
            id: uid(),
            content,
            disableBackdropClose,
            resolve
          }
        })
      })
    },
    closeModal<R>(id: string, result?: R): void {
      const modal = state.modals.find(m => m.id === id)
      if (modal) {
        modal.resolve(result)
        dispatch({ type: 'CloseModal', payload: { id: modal.id } })
      }
    },
    openNotification(): void {
      // FIXME: implement openNotification
    }
  }

  return (
    <OverlayContext.Provider value={state}>
      <OverlayDispatchContext.Provider value={api}>
        {children}
        <ModalOverlay modals={state.modals} />
      </OverlayDispatchContext.Provider>
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

const body = window.document.body

interface ModalOverlayProps {
  modals: State['modals']
}

function ModalOverlay({ modals }: ModalOverlayProps) {
  body.classList.toggle('modal-open', !!modals.length)

  if (!modals.length) return null

  return (
    <div>
      <div className="modal-backdrop fade show" />
      {modals.map(({ id, content, disableBackdropClose }, idx) => {
        const isActive = modals.length - 1 === idx

        return (
          <DialogProvider id={id} key={id}>
            <Modal isActive={isActive} disableBackdropClose={disableBackdropClose}>
              {content}
            </Modal>
          </DialogProvider>
        )
      })}
    </div>
  )
}

interface ModalProps {
  children: ReactNode
  isActive: boolean
  disableBackdropClose: DialogData['disableBackdropClose']
}

function Modal({ children, isActive, disableBackdropClose }: ModalProps) {
  const { closeModal } = useDialog()

  const close = event => {
    if (!disableBackdropClose && event.target === event.currentTarget) {
      closeModal()
    }
  }

  return (
    <div
      className={cx('d-block', 'modal', 'fade', 'show', { 'active-modal': isActive })}
      role="dialog"
      onClick={close}
    >
      {children}
    </div>
  )
}
