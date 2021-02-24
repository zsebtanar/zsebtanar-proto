import React from 'react'

interface Props {
  children?: React.ReactNode
}

export function CodeExample({ children }: Props): JSX.Element {
  return (
    <code>
      <br />
      {children}
    </code>
  )
}
