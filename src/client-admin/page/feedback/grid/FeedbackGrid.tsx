import { GridComponent } from 'client-common/component/grid/GridComponent'
import { FeedbackDataModel, FeedbackService } from 'client-common/services/feedbackService'
import { FireStoreGridDS } from 'client-common/services/fireStoreGridDS'
import * as React from 'react'

const opt = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
}
const dateFormatter = new Intl.DateTimeFormat('hu', opt)

export class FeedbackGrid extends React.PureComponent<{}> {
  private ds = new FireStoreGridDS(FeedbackService)

  render(): React.ReactNode {
    const Grid = GridComponent as new () => GridComponent<FeedbackDataModel>

    return (
      <div>
        <div className="btn-toolbar justify-content-between align-items-center">
          <h3>Visszajelzések</h3>
        </div>
        <Grid
          dataSource={this.ds}
          columnDefs={[
            { title: '#', width: 50, renderer: (data, row, idx) => idx + 1 },
            { key: 'site', title: 'Oldal', width: 75 },
            { key: 'type', title: 'Típus', width: 75 },
            { key: 'state', title: 'Állapot', width: 75 },
            { key: 'email', title: 'E-mail', width: 150 },
            {
              key: 'created',
              title: 'Létrehozva',
              width: 200,
              renderer: this.renderDate
            },
            { key: 'description', title: 'Visszajelzés szövege' }
          ]}
        />
      </div>
    )
  }

  private renderDate(data) {
    return data ? dateFormatter.format(data.toDate()) : ''
  }
}
