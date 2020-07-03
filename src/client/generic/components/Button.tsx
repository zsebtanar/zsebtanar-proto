import React from 'react'
import cx from 'classnames'
import { IconDefinition } from '@fortawesome/fontawesome-common-types'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './Button.scss'

interface ButtonProps extends Omit<React.HTMLProps<HTMLButtonElement>, 'type' | 'onClick'> {
  btn?: ButtonType
  icon?: IconDefinition
  loading?: boolean
  submit?: boolean
  inline?: boolean
  onAction?: (event: MouseEvent) => void
  small?: boolean
}

export function Button({
  btn,
  onAction,
  tabIndex,
  icon,
  submit,
  className,
  title,
  disabled,
  loading,
  inline,
  children,
  small,
}: ButtonProps): JSX.Element {
  const onClick =
    onAction &&
    ((event) => {
      event.preventDefault()
      onAction?.(event)
    })

  return (
    <button
      type={submit ? 'submit' : 'button'}
      className={cx(className, 'btn', `btn-${btn || 'secondary'}`, {
        'btn-inline': inline,
        'btn-sm': small,
      })}
      onClick={onClick}
      tabIndex={tabIndex}
      title={title}
      aria-label={title}
      disabled={disabled || loading}
    >
      {icon && <FontAwesomeIcon icon={icon} fixedWidth className="mr-1" />}
      {children}
      {loading && <FontAwesomeIcon icon={faCog} fixedWidth spin />}
    </button>
  )
}
