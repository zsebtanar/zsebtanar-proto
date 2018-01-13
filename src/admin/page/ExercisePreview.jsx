import { evolve, mapObjIndexed, pathOr } from 'ramda'
import { pairsInOrder } from 'shared/util/fn'
import * as React from 'react'
import { Exercise } from 'shared/page/exercise/Exercise'
import { TASK_STATUS_PREVIEW } from 'shared/store/exercise'
import { getPrivateExercise } from 'shared/services/exercise'
import Loading from 'shared/component/general/Loading'

export class ExercisePreview extends React.Component {
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
        {__DEV__ ? <pre className="text-muted">{JSON.stringify(this.state.exercise, null, 3)}</pre> : ''}
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
      return <Exercise previewMode exercise={exercise} />
    }
  }
}

const prepareExercise = evolve({
  subTasks: mapObjIndexed(task => ({
    details: task,
    order: task.order,
    status: TASK_STATUS_PREVIEW,
    hints: pairsInOrder(task.hints).map(([key, hint]) => ({key, hint})),
    hintsLeft: 0,
    validity: {}
  }))
})
