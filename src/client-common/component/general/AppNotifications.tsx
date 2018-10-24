import * as React from 'react'
import { connect } from 'react-redux'
import { Notification } from './Notification'
import { removeNotification } from '../../store/notifications'
import { isPositiveInt } from '../../../shared/util/math'

import './AppNotifications.scss'

interface StoreProps {
  notifications: state.Notification[]
}

interface DispatchProps {
  removeNotification: typeof removeNotification
}

const mapStateToProps = (state: state.Root) => ({
  notifications: state.app.notifications.list
})

const mapDispatchToProps = { removeNotification }

///

export const AppNotifications = connect<StoreProps, DispatchProps, {}>(
  mapStateToProps,
  mapDispatchToProps
)(
  class extends React.Component<StoreProps & DispatchProps> {
    render(): React.ReactNode {
      return (
        <div className="notifications" aria-live="polite">
          <div className="col-md-8 mx-auto">
            {this.props.notifications.map(this.renderNotifications)}
          </div>
        </div>
      )
    }

    private renderNotifications = (item: state.Notification) => {
      const { id, type, message, options } = item
      const onDismiss = isPositiveInt(options.timeout) ? undefined : this.dismissNotify(id)
      return (
        <Notification key={id} type={type} onDismiss={onDismiss}>
          {message}
        </Notification>
      )
    }

    private dismissNotify = (id: string) => () => {
      this.props.removeNotification(id)
    }
  }
)
