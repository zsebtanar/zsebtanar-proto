import React, { ReactNode } from 'react'
import { AttachmentList } from '../types'

interface Props {
  attachments: AttachmentList
  children: ReactNode
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AttachmentContext = React.createContext<AttachmentList>({} as any)

export function AttachmentProvider({ children, attachments }: Props) {
  return <AttachmentContext.Provider value={attachments}>{children}</AttachmentContext.Provider>
}

export function useAttachment() {
  const context = React.useContext(AttachmentContext)
  if (context === undefined) {
    throw new Error('useAttachment must be used within a AttachmentContext')
  }
  return context
}
