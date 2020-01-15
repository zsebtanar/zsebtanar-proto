import React from 'react'

export function CloseButton(props: React.ButtonHTMLAttributes<{}>) {
  return (
    <button type="button" className="close" aria-label="Bezárás" {...props}>
      <span aria-hidden="true">&times;</span>
    </button>
  )
}
