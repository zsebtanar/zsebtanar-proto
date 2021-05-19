import React, { ReactNode, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'

interface BackJourneyContextAPI {
  addEntry()
  back(replace?: boolean)
}

interface Props {
  defaultPath: string
  stackSize: number
  children: ReactNode
}

///

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const BackJourneyContext = React.createContext<BackJourneyContextAPI>({} as any)

export function BackJourneyProvider({ stackSize, defaultPath, children }: Props): JSX.Element {
  const [stack, setStack] = useState<string[]>([])
  const history = useHistory()
  const api: BackJourneyContextAPI = {
    addEntry() {
      const { pathname, search } = window.location
      const path = (pathname ?? defaultPath) + (search ?? '')
      setStack((stack) => [path, ...stack].slice(0, stackSize))
    },
    back(replace: boolean) {
      const path = stack[0] ?? defaultPath
      setStack(([, ...stack]) => stack)
      if (replace) {
        history.replace(path)
      } else {
        history.push(path)
      }
    },
  }

  return <BackJourneyContext.Provider value={api}>{children}</BackJourneyContext.Provider>
}

export function useBackJourney() {
  const context = useContext(BackJourneyContext)
  if (context === undefined) {
    throw new Error('useBackJourney must be used within a BackJourneyContext')
  }
  return context
}
