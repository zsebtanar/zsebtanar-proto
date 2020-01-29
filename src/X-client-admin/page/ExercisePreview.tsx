import * as React from 'react'
import { evolve, mapObjIndexed, pathOr } from 'ramda'
import { pairsInOrder } from 'shared/util/fn'
import { Exercise } from 'client-common/page/exercise/Exercise'
import { TASK_STATUS_PREVIEW } from 'client-common/store/exercise'
import { getPrivateExercise } from 'client-common/services/exercise'
import { Loading } from 'client-common/component/general/Loading'
import { Icon } from 'client-common/component/general/Icon'

export class ExercisePreview extends React.Component<any, any> {
  state = {
    exercise: null
  }

  componentWillMount() {
    const exerciseId = pathOr(false, ['match', 'params', 'key'], this.props)
    const exercise = this.props.exercise
    if (exerciseId) {
      getPrivateExercise(exerciseId).then(exercise =>
        this.setState({ exercise: prepareExercise(exercise) })
      )
    } else if (exercise) {
      this.setState({ exercise: prepareExercise(exercise) })
    } else {
      this.setState({ exercise: undefined })
    }
  }

  render() {
    return (
      <div>
        <div className="my-4">{this.renderExercise()}</div>
        <hr />
        {__DEV__ ? (
          <pre className="text-muted">{JSON.stringify(this.state.exercise, null, 3)}</pre>
        ) : (
          ''
        )}
      </div>
    )
  }

  renderExercise() {
    const exercise = this.state.exercise
    if (exercise === null) {
      return <Loading />
    } else if (exercise === undefined) {
      return <div className="alert alert-danger">A feladat nemtalálható</div>
    } else {
      return (
        <div>
          <div className="col-10 mx-auto my-4 alert alert-info row">
            <div className="col-1">
              <Icon fa="info-circle" size="2x" />
            </div>
            <div className="col-11">
              <small>
                A feladat előnézete csak tájékoztató jellegű. A következőkben tér az éles
                megjelenítéstől:
                <ul>
                  <li>Minden részfeladatot és útmutatót egyszerre jelenik meg</li>
                </ul>
              </small>
            </div>
          </div>
          <Exercise previewMode exercise={exercise} />
        </div>
      )
    }
  }
}

const prepareExercise = evolve({
  subTasks: mapObjIndexed((task: DB.SubTask) => ({
    details: task,
    order: task.order,
    status: TASK_STATUS_PREVIEW,
    hints: pairsInOrder(task.hints).map(([key, hint]) => ({ key, hint })),
    hintsLeft: 0,
    validity: {}
  }))
})
