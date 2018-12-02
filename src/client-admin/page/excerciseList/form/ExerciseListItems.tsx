import { Alert } from 'client-common/component/general/Alert'
import { Button } from 'client-common/component/general/Button'
import { Icon } from 'client-common/component/general/Icon'
import { Loading } from 'client-common/component/general/Loading'
import { Sortable } from 'client-common/component/general/Sortable'
import { getPublicExercise, selectPublicExercisesById } from 'client-common/services/exercise'
import { ExerciseListItem } from 'client-common/services/exercise-list'
import { openExerciseSearch } from 'client-common/store/actions/modal'
import { prop } from 'ramda'
import * as React from 'react'
import { connect } from 'react-redux'
import { setExerciseListField } from '../exerciseListFormReducer'
import { ExerciseListItem as ExerciseListItemComponent } from './ExerciseListItem'

///

interface Props {
  onChange: any
  items: ExerciseListItem[]
}

interface DispatchProps {
  setField: typeof setExerciseListField
  openExerciseSearch: typeof openExerciseSearch
}

type AllProps = Props & DispatchProps

interface State {
  loading: boolean
  exercises: DB.Exercise[]
}

///

const mapDispatchToProps = {
  setField: setExerciseListField,
  openExerciseSearch
}

///

export const ExerciseListItems = connect<{}, DispatchProps, Props>(
  undefined,
  mapDispatchToProps
)(
  class extends React.Component<AllProps, State> {
    state = {
      loading: true,
      exercises: []
    }

    private setItems = value => {
      this.props.setField(['data', 'items'], value)
    }

    private addExercise = exerciseId => {
      this.setState({})
      this.setItems(this.props.items.concat({ exerciseId }))
      getPublicExercise(exerciseId).then(res =>
        this.setState({ loading: false, exercises: this.state.exercises.concat(res) })
      )
    }

    private removeExercise = key => key

    private openAddExercise = () => {
      this.props.openExerciseSearch({ onSuccess: this.addExercise })
    }

    private openRemoveExercise = key => () =>
      confirm('Biztosan, hogy törölni szeretnéd?') && this.removeExercise(key)

    componentWillMount(): void {
      const items = this.props.items
      if (items && items.length) {
        selectPublicExercisesById(this.props.items.map(prop('exerciseId'))).then(res =>
          this.setState({ loading: false, exercises: res })
        )
      } else {
        this.setState({ loading: false, exercises: [] })
      }
    }

    render() {
      return (
        <div>
          <div className="d-flex justify-content-between">
            <h5>Feladatok:</h5>
            <Button
              title="Feladat hozzáadása"
              onAction={this.openAddExercise}
              className="btn btn-sm btn-outline-primary"
            >
              <Icon fa="plus" /> Feladat hozzáadása
            </Button>
          </div>
          {this.renderList()}
        </div>
      )
    }

    renderList() {
      const { loading, exercises } = this.state
      if (loading) return <Loading />
      if (!exercises.length) return <Alert type="info">A feladatlista üres.</Alert>
      return (
        <div className="list-group my-2">
          <Sortable
            list={exercises}
            itemComponent={ExerciseListItemComponent}
            onChange={this.setItems}
            itemProps={{
              openRemoveExercise: this.openRemoveExercise
            }}
          />
        </div>
      )
    }
  }
)
