import { GridComponent } from 'client-common/component/grid/GridComponent'
import { FireStoreGridDS } from 'client-common/services/fireStoreGridDS'
import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { Icon } from 'client-common/component/general/Icon'
import { MainCategoryModel, MainCategoryService } from 'client-common/services/categoriesService'

export class MainCategoryGrid extends React.PureComponent<{}> {
  private ds = new FireStoreGridDS(MainCategoryService)

  render(): React.ReactNode {
    const Grid = GridComponent as new () => GridComponent<MainCategoryModel>

    return (
      <div>
        <div className="btn-toolbar justify-content-between align-items-center">
          <h3>Főkategóriák</h3>
        </div>
        <Grid
          dataSource={this.ds}
          columnDefs={[
            { title: '#', width: 50, renderer: (data, row, idx) => idx + 1 },
            { key: 'title', title: 'Név' },
            { title: 'Opciók', width: 200, renderer: (_, row) => this.renderListItem(row) }
          ]}
        />
      </div>
    )
  }

  private renderListItem = (item: MainCategoryModel) => {
    return (
      <div className="text-center">
        <NavLink
          exact
          to={`/sub-categories/${item.id}`}
          className="btn btn-sm btn-light"
          title="Alkategóriák"
        >
          <Icon fa="list" />
        </NavLink>
        &nbsp;
        <a
          onClick={() => this.editCategory(item)}
          className="btn btn-sm btn-light"
          title="Kategória szerkesztése"
        >
          <Icon fa="edit" />
        </a>
      </div>
    )
  }

  private editCategory(item: MainCategoryModel) {

  }
}
