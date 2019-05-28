import { Icon } from 'client-common/component/general/Icon'
import { GridComponent } from 'client-common/component/grid/GridComponent'
import {
  MainCategoryModel,
  SubCategoryModel,
  SubCategoryService
} from 'client-common/services/categoriesService'
import { FireStoreGridDS } from 'client-common/services/fireStoreGridDS'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'

type RouteProps = RouteComponentProps<{ id: string }>

export const SubCategoryGrid = withRouter(
  class extends React.PureComponent<RouteProps> {
    private ds = new FireStoreGridDS(SubCategoryService(this.props.match.params.id))

    render(): React.ReactNode {
      const Grid = GridComponent as new () => GridComponent<SubCategoryModel>

      return (
        <div>
          <div className="btn-toolbar justify-content-between align-items-center">
            <h3>Alkategóriák</h3>
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

    private renderListItem = (item: SubCategoryModel) => {
      return (
        <div className="text-center">
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

    private editCategory(item: MainCategoryModel) {}
  }
)
