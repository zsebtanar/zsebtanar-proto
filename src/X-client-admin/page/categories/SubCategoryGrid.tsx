import * as React from 'react'
import { connect } from 'react-redux'
import { pipe } from 'ramda'
import { openTextPromptModal } from 'client-common/store/actions/modal'
import { Button } from 'client-common/component/general/Button'
import { Icon } from 'client-common/component/general/Icon'
import { GridComponent } from 'client-common/component/grid/GridComponent'
import { GridToolBar } from 'client-common/component/grid/GridToolbar'
import { SubCategoryModel, SubCategoryService } from 'client-common/services/categoriesService'
import { FireStoreGridDS } from 'client/generic/services/fireStoreGridDS'
import { RouteComponentProps, withRouter } from 'react-router'

///

interface DispatchProps {
  openTextPromptModal: typeof openTextPromptModal
}

type Props = DispatchProps & RouteComponentProps<{ id: string }>

const mapDispatchToProps = {
  openTextPromptModal
}

///

export const SubCategoryGrid = pipe(
  withRouter,
  connect<undefined, DispatchProps, undefined>(
    undefined,
    mapDispatchToProps
  )
)(
  class extends React.PureComponent<Props> {
    private ds = new FireStoreGridDS(SubCategoryService(this.props.match.params.id))

    render(): React.ReactNode {
      const Grid = GridComponent as new () => GridComponent<SubCategoryModel>

      return (
        <div>
          <GridToolBar>
            <h3>Alkategóriák</h3>
            <Button
              className="btn btn-outline-secondary"
              icon="plus"
              onAction={this.subCreateCategory}
            >
              Új alkategória
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

    private renderListItem = (item: SubCategoryModel) => {
      return (
        <div className="text-center">
          <a
            onClick={() => this.editSubCategory(item)}
            className="btn btn-sm btn-light"
            title="Kategória szerkesztése"
          >
            <Icon fa="edit" />
          </a>
        </div>
      )
    }

    private subCreateCategory = () => {
      this.props.openTextPromptModal({
        title: 'Új kategória',
        label: 'Név',
        value: '',
        onSuccess: this.saveNewSubCategory
      })
    }

    private saveNewSubCategory = async (newTitle: string) => {
      await this.ds.service.create({ title: newTitle })
      await this.ds.refresh()
    }

    private editSubCategory = (item: SubCategoryModel) => {
      this.props.openTextPromptModal({
        title: 'Kategória módosítása',
        label: 'Név',
        value: item.title,
        onSuccess: this.updateCategoryTitle(item)
      })
    }

    private updateCategoryTitle = (item: SubCategoryModel) => async (newTitle: string) => {
      await this.ds.service.update({ ...item, ...{ title: newTitle } })
      await this.ds.refresh()
    }
  }
)
