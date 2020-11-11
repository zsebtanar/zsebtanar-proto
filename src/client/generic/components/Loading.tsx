import React from 'react'
import { Settings as SettingsIcon } from 'react-feather'
import { Icon } from './icons/Icon'

export function Loading(): JSX.Element {
  return (
    <div className="text-center my-5">
      <span>
        <Icon icon={SettingsIcon} />
        &nbsp;Kis türelmet ...
      </span>
    </div>
  )
}
