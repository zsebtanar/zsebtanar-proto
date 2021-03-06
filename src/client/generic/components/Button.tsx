import React from 'react'
import cx from 'classnames'
import {
  Settings as SettingsIcon,
  Icon as IconType,
  AlertTriangle as AlertTriangleIcon,
} from 'react-feather'
import { Icon } from './icons/Icon'

import './Button.scss'
import { ButtonType } from '../../../shared/generic/types'

interface ButtonProps extends Omit<React.HTMLProps<HTMLButtonElement>, 'type' | 'onClick'> {
  btn?: ButtonType
  icon?: IconType
  loading?: boolean
  submit?: boolean
  inline?: boolean
  onAction?: (event: MouseEvent) => void
  small?: boolean
  large?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
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
    large,
  }: ButtonProps,
  ref,
): JSX.Element {
  const onClick =
    onAction &&
    ((event) => {
      event.preventDefault()
      onAction?.(event)
    })

  return (
    <button
      ref={ref}
      type={submit ? 'submit' : 'button'}
      className={cx(className, 'btn', `btn-${btn || 'secondary'}`, {
        'btn-inline': inline,
        'btn-sm': small,
        'btn-lg': large,
      })}
      onClick={onClick}
      tabIndex={tabIndex}
      title={title}
      aria-label={title}
      disabled={disabled || loading}
    >
      {icon && <Icon icon={icon} />}
      {children}
      {loading && <Icon icon={SettingsIcon} />}
    </button>
  )
})
