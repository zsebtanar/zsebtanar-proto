import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { exerciseList, ExerciseList } from 'client-common/services/exercise-list'
import { Icon } from 'client-common/component/general/Icon'
import { Loading } from 'client-common/component/general/Loading'
import { Alert } from 'client-common/component/general/Alert'

///

interface State {
  loading: boolean
  exerciseLists: ExerciseList[]
}

///

export class ExerciseListsGrid extends React.Component<{}, State> {
  state = {
    loading: false,
    exerciseLists: undefined
  }

  componentWillMount() {
    this.loadList()
  }

  private loadList() {
    this.setState({ loading: true })
    exerciseList.getAll().then(data => this.setState({ loading: false, exerciseLists: data }))
  }

  render(): React.ReactNode {
    const { loading } = this.state

    return (
      <div>
        <div className="btn-toolbar justify-content-between align-items-center">
          <h3>Feladatsorok</h3>
          <NavLink exact to="/exercise-list/add" className="btn btn-outline-secondary">
            <i className="fa fa-plus" /> Feladatsor létrehozása
          </NavLink>
        </div>
        {loading && <Loading />}
        {this.renderList()}
      </div>
    )
  }

  private renderList() {
    const { exerciseLists } = this.state
    if (!exerciseLists) return

    if (!exerciseLists.length) return (<Alert className="my-3" type="info">
      Feladatsor nem található. Hozzlétre egy újat.
    </Alert>)

    return (
      <table className="table table-hover table mt-3 exercise-list-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Cím</th>
            <th className="text-center action-column">
              <Icon fa="fa" />
            </th>
          </tr>
        </thead>
        <tbody>{exerciseLists.map(this.renderListItem)}</tbody>
      </table>
    )
  }

  private renderListItem = (item: ExerciseList, idx) => {
    return (
      <tr key={item.id}>
        <td>{idx + 1}</td>
        <td>{item.title}</td>
        <td className="text-right">
          <NavLink
            exact
            to={`/exercise-list/view/${item.id}`}
            className="btn btn-sm btn-light"
            title="Megtekintés"
          >
            <Icon fa="eye" />
          </NavLink>
          &nbsp;
          <NavLink
            exact
            to={`/exercise-list/add/${item.id}`}
            className="btn btn-sm btn-light"
            title="Feladat másolása"
          >
            <Icon fa="clone" />
          </NavLink>
          &nbsp;
          <NavLink
            exact
            to={`/exercise-list/edit/${item.id}`}
            className="btn btn-sm btn-light"
            title="Feladat szerkesztése"
          >
            <Icon fa="edit" />
          </NavLink>
        </td>
      </tr>
    )
  }
}
