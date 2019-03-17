import { Icon } from 'client-common/component/general/Icon'
import { FireStoreGridDS } from 'client-common/services/fireStoreGridDS'
import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { GridComponent } from 'client-common/component/grid/GridComponent'
import { wikiPageService, WikiPageModel } from 'client-common/services/wikiPageService'

export class WikiPageGrid extends React.PureComponent<{}> {
  private ds = new FireStoreGridDS(wikiPageService)

  render(): React.ReactNode {
    const Grid = GridComponent as new () => GridComponent<WikiPageModel>

    return (
      <div>
        <div className="btn-toolbar justify-content-between align-items-center">
          <h3>Wiki oldalak</h3>
          <NavLink exact to="/wiki-page/add" className="btn btn-outline-secondary">
            <i className="fa fa-plus" /> Új Wiki oldal
          </NavLink>
        </div>
        <Grid
          dataSource={this.ds}
          columnDefs={[
            { title: '#', width: 100, renderer: (data, row, idx) => idx + 1 },
            { key: 'title', title: 'Név' },
            { title: 'Opciók', width: 200, renderer: (_, row) => this.renderListItem(row) }
          ]}
        />
      </div>
    )
  }

  private renderListItem = (item: WikiPageModel) => {
    return (
      <div className="text-center">
        <NavLink
          exact
          to={`/wiki-page/add/${item.id}`}
          className="btn btn-sm btn-light"
          title="Wiki oldal másolása"
        >
          <Icon fa="clone" />
        </NavLink>
        &nbsp;
        <NavLink
          exact
          to={`/wiki-page/edit/${item.id}`}
          className="btn btn-sm btn-light"
          title="Wiki oldal szerkesztése"
        >
          <Icon fa="edit" />
        </NavLink>
      </div>
    )
  }
}
