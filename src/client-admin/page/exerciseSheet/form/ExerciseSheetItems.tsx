import { Alert } from 'client-common/component/general/Alert'
import { Button } from 'client-common/component/general/Button'
import { Icon } from 'client-common/component/general/Icon'
import { Loading } from 'client-common/component/general/Loading'
import { Sortable } from 'client-common/component/general/Sortable'
import { getPublicExercise, selectPublicExercisesById } from 'client-common/services/exercise'
import { ExerciseSheetItem as ItemService } from 'client-common/services/exerciseSheet'
import { openConfirmModal, openExerciseSearch } from 'client-common/store/actions/modal'
import { append, filter, lensPath, prop, propEq } from 'ramda'
import * as React from 'react'
import { connect } from 'react-redux'
import { propNotEq } from 'shared/util/fn'
import { removeExercise, setExerciseSheetField } from '../exerciseSheetReducer'
import { ExerciseSheetItem } from './ExerciseSheetItem'

///

interface Props {
  onChange: any
  items: ItemService[]
}

interface DispatchProps {
  setField: typeof setExerciseSheetField
  removeExercise: typeof removeExercise
  openExerciseSearch: typeof openExerciseSearch
  openConfirmModal: typeof openConfirmModal
}

type AllProps = Props & DispatchProps

interface State {
  loading: boolean
  exercises: DB.Exercise[]
}

///

const mapDispatchToProps = {
  setField: setExerciseSheetField,
  removeExercise,
  openExerciseSearch,
  openConfirmModal
}

const itemsL = lensPath(['data', 'items'])

///

export const ExerciseSheetItems = connect<{}, DispatchProps, Props>(
  undefined,
  mapDispatchToProps
)(
  class extends React.Component<AllProps, State> {
    state = {
      loading: true,
      exercises: []
    }

    public componentWillMount(): void {
      const items = this.props.items
      if (items && items.length) {
        selectPublicExercisesById(this.props.items.map(prop('exerciseId'))).then(res =>
          this.setState({ loading: false, exercises: res })
        )
      } else {
        this.setState({ loading: false, exercises: [] })
      }
    }

    private setItems = fn => {
      const { setField, items } = this.props
      setField(itemsL, fn(items))
    }

    private addExercise = exerciseId => {
      this.setState({ loading: true })
      this.setItems(append({ exerciseId }))
      getPublicExercise(exerciseId).then(res =>
        this.setState({ loading: false, exercises: this.state.exercises.concat(res) })
      )
    }

    private removeExercise = exerciseId => {
      const { removeExercise, items } = this.props
      this.setItems(filter(propNotEq('exerciseId', exerciseId)))
      removeExercise((items.find(propEq('exerciseId', exerciseId)) || { id: undefined }).id)
      this.setState({ exercises: filter(propNotEq('_key', exerciseId), this.state.exercises) })
    }

    private openAddExercise = () => {
      this.props.openExerciseSearch({ onSuccess: this.addExercise })
    }

    private openRemoveExercise = exerciseId => () =>
      this.props.openConfirmModal({
        content: 'Biztos eltávolítod a feladatot a feladatsorból?',
        onSuccess: () => this.removeExercise(exerciseId)
      })

    public render() {
      return (
        <div>
          <div className="d-flex justify-content-between">
            <label htmlFor="exercise-list-items">Feladatok:</label>
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

    private renderList() {
      const { loading, exercises } = this.state
      if (loading) return <Loading />
      if (!exercises.length) return <Alert type="info">A feladatlista üres.</Alert>
      return (
        <div className="list-group my-2" id="exercise-list-items">
          <Sortable
            list={exercises}
            itemComponent={ExerciseSheetItem}
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
