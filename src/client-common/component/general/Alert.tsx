import * as React from 'react'
import * as cx from 'classnames'
import { CloseButton } from './CloseButton'

interface Props {
  type?: AlertType
  className?: string
  onDismiss?: () => void
}

export class Alert extends React.PureComponent<Props> {
  render(): React.ReactNode {
    const { type, className, children, onDismiss } = this.props
    return (
      <div className={cx('alert', `alert-${type}`, className)}>
        {children}
        {onDismiss && <CloseButton onClick={onDismiss} />}
      </div>
    )
  }
}
