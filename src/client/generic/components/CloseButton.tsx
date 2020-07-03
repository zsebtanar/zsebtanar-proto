import React from 'react'

export function CloseButton(props: Omit<React.HTMLProps<HTMLButtonElement>, 'type'>): JSX.Element {
  return (
    <button type={'button'} className="close" aria-label="Bezárás" {...props}>
      <span aria-hidden="true">&times;</span>
    </button>
  )
}
