import { Icon } from 'client-common/component/general/Icon'
import { exerciseSheet, ExerciseSheet } from 'client-common/services/exerciseSheet'
import { FireStoreGridDS } from 'client-common/services/fireStoreGridDS'
import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { GridComponent } from '../../../../client-common/component/grid/GridComponent'

export class ExerciseSheetGrid extends React.PureComponent<{}> {
  private ds = new FireStoreGridDS(exerciseSheet)

  render(): React.ReactNode {
    const Grid = GridComponent as new () => GridComponent<ExerciseSheet>

    return (
      <div>
        <div className="btn-toolbar justify-content-between align-items-center">
          <h3>Feladatsorok</h3>
          <NavLink exact to="/exercise-sheet/add" className="btn btn-outline-secondary">
            <i className="fa fa-plus" /> Feladatsor létrehozása
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

  private renderListItem = (item: ExerciseSheet) => {
    return (
      <div className="text-center">
        <NavLink
          exact
          to={`/exercise-sheet/add/${item.id}`}
          className="btn btn-sm btn-light"
          title="Feladat másolása"
        >
          <Icon fa="clone" />
        </NavLink>
        &nbsp;
        <NavLink
          exact
          to={`/exercise-sheet/edit/${item.id}`}
          className="btn btn-sm btn-light"
          title="Feladat szerkesztése"
        >
          <Icon fa="edit" />
        </NavLink>
      </div>
    )
  }
}
