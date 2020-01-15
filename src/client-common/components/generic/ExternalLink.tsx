import React from 'react'

export function ExternalLink(props: React.AnchorHTMLAttributes<{}>) {
  return (
    <a {...props} target="_blank" rel="noopener noreferrer">
      {props.children}
    </a>
  )
}
