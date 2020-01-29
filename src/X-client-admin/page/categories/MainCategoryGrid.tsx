import { Button } from 'client-common/component/general/Button'
import { GridComponent } from 'client-common/component/grid/GridComponent'
import { GridToolBar } from 'client-common/component/grid/GridToolbar'
import { FireStoreGridDS } from 'client/generic/services/fireStoreGridDS'
import { openTextPromptModal } from 'client-common/store/actions/modal'
import * as React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Icon } from 'client-common/component/general/Icon'
import { MainCategoryModel, MainCategoryService } from 'client-common/services/categoriesService'

///

interface DispatchProps {
  openTextPromptModal: typeof openTextPromptModal
}

const mapDispatchToProps = {
  openTextPromptModal
}

///

export const MainCategoryGrid = connect<undefined, DispatchProps, undefined>(
  undefined,
  mapDispatchToProps
)(
  class MainCategoryGridComp extends React.PureComponent<DispatchProps> {
    private ds = new FireStoreGridDS(MainCategoryService)

    render(): React.ReactNode {
      const Grid = GridComponent as new () => GridComponent<MainCategoryModel>

      return (
        <div>
          <GridToolBar>
            <h3>Főkategóriák</h3>

            <Button
              className="btn btn-outline-secondary"
              icon="plus"
              onAction={this.createCategory}
            >
              Új kategória
            </Button>
          </GridToolBar>
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
            to={`/categories/${item.id}`}
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

    private createCategory = () => {
      this.props.openTextPromptModal({
        title: 'Új kategória',
        label: 'Név',
        value: '',
        onSuccess: this.saveNewCategory
      })
    }

    private saveNewCategory = async (newTitle: string) => {
      await this.ds.service.create({ title: newTitle })
      await this.ds.refresh()
    }

    private editCategory = (item: MainCategoryModel) => {
      this.props.openTextPromptModal({
        title: 'Kategória módosítása',
        label: 'Név',
        value: item.title,
        onSuccess: this.updateCategoryTitle(item)
      })
    }

    private updateCategoryTitle = (item: MainCategoryModel) => async (newTitle: string) => {
      await this.ds.service.update({ ...item, ...{ title: newTitle } })
      await this.ds.refresh()
    }
  }
)
