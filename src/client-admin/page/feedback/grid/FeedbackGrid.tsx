import { Icon } from 'client-common/component/general/Icon'
import { FireStoreGridDS } from 'client-common/services/fireStoreGridDS'
import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { GridComponent } from 'client-common/component/grid/GridComponent'
import {
  FeedbackDataModel,
  FeedbackService
} from 'client-common/services/FeedbackService'

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
            { title: '#', width: 100, renderer: (data, row, idx) => idx + 1 },
            { key: 'type', title: 'Típus', width: 100 },
            { key: 'state', title: 'Állapot', width: 100 },
            { key: 'site', title: 'Oldal', width: 100 },
            { key: 'description', title: 'Visszajelzés szövege' },
            { title: 'Opciók', width: 200, renderer: (_, row) => this.renderListItem(row) }
          ]}
        />
      </div>
    )
  }

  private renderListItem = (item: FeedbackDataModel) => {
    return (
      <div className="text-center">
        <NavLink
          exact
          to={`/wiki-page/edit/${item.id}`}
          className="btn btn-sm btn-light"
          title="Visszajelzés megtekintése"
        >
          <Icon fa="edit" />
        </NavLink>
      </div>
    )
  }
}
