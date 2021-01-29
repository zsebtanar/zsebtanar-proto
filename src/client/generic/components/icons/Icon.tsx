import React, { SVGAttributes } from 'react'
import { Icon as IconType } from 'react-feather'

interface Props extends SVGAttributes<SVGElement> {
  size?: string | number
  icon?: IconType
}

export function Icon({ icon, className, size, ...props }: Props): JSX.Element {
  const Component = icon as IconType
  return <Component className={`svg-icon ${className}`} size={size ?? 18} {...props} />
}
