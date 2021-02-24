import React from 'react'

interface Props {
  children?: React.ReactNode
}

export function CodeExample({ children }: Props): JSX.Element {
  return (
    <pre>
      <code>{children}</code>
    </pre>
  )
}
