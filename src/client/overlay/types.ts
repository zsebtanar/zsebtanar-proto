import { ReactNode } from 'react'

export type DialogSize = 'small' | 'large'

export interface DialogData<R = any> {
  id: string
  content: ReactNode
  disableBackdropClose?: boolean
  resolve: (res?: R) => void
}
