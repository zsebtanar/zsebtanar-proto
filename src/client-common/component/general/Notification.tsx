import * as React from 'react'
import * as cx from 'classnames'
import { CloseButton } from './CloseButton'

interface Props {
  type?: NotificationType
  className?: string
  onDismiss?: () => void
}

export class Notification extends React.PureComponent<Props> {
  render(): React.ReactNode {
    const { type, className, children, onDismiss } = this.props
    return (
      <div className={cx('alert', alertType(type), className)}>
        {children}
        {onDismiss && <CloseButton onClick={onDismiss} />}
      </div>
    )
  }
}

function alertType(type: NotificationType) {
  switch (type) {
    case NotificationType.Danger:
      return 'alert-danger'
    case NotificationType.Dark:
      return 'alert-dark'
    case NotificationType.Info:
      return 'alert-info'
    case NotificationType.Light:
      return 'alert-light'
    case NotificationType.Primary:
      return 'alert-primary'
    case NotificationType.Secondary:
      return 'alert-secondary'
    case NotificationType.Success:
      return 'alert-success'
    case NotificationType.Warning:
      return 'alert-warning'
  }
}
