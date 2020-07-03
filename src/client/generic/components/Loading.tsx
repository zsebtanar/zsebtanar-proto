import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'

export function Loading(): JSX.Element {
  return (
    <div className="text-center my-5">
      <span>
        <FontAwesomeIcon icon={faCog} spin size="2x" fixedWidth />
        &nbsp;Kis türelmet ...
      </span>
    </div>
  )
}
