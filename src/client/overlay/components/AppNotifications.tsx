import React from 'react'
import { Alert } from '../../generic/components/Alert'
import { isNotZeroInteger } from 'shared/utils/math'

import './AppNotifications.scss'

///

export function AppNotifications (){
      return (
        <div className="notifications" aria-live="polite">
          <div className="col-md-8 col-lg-4 mx-auto">
            {this.props.notifications.map(this.renderNotifications)}
          </div>
        </div>
      )
    }

    private renderNotifications = (item: state.Notification) => {
      const { id, type, message, options } = item
      const onDismiss = isNotZeroInteger(options.timeout) ? undefined : this.dismissNotify(id)
      return (
        <Alert key={id} type={type} onDismiss={onDismiss}>
          {message}
        </Alert>
      )
    }

    private dismissNotify = (id: string) => () => {
      this.props.removeNotification(id)
    }
  }
)
