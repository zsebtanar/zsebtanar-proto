import React, { ReactNode, useState } from 'react'

interface Context {
  isOpen: boolean
  open: () => void
  close: () => void
}

interface Props {
  children: ReactNode
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DropdownContext = React.createContext<Context>({} as any)

export function DropdownProvider({ children }: Props) {
  const [isOpen, setOpen] = useState(false)

  const api = {
    isOpen,
    open: () => setOpen(true),
    close: () => setOpen(false)
  }

  return <DropdownContext.Provider value={api}>{children}</DropdownContext.Provider>
}

export function useDropdown() {
  const context = React.useContext(DropdownContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserContext')
  }
  return context
}
