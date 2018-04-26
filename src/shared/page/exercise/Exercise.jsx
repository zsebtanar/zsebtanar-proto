import { compose, pathOr } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter, NavLink } from 'react-router-dom'
import { abcIndex, pairsInOrder } from 'shared/util/fn'
import { Markdown } from 'shared/component/general/Markdown'
import { openExerciseResultModal } from 'shared/store/actions/modal'
import Loading from 'shared/component/general/Loading'
import { SubTask } from 'shared/page/exercise/SubTask'
import {
  getPublicExerciseAction,
  unloadExerciseAction,
  TASK_STATUS_WAITING
} from 'shared/store/exercise'
import { ProgressBar } from 'shared/ui/Progress'

const mapStateToProps = (state, ownProps) => {
  const exercise = ownProps.exercise || state.app.exercise.item
  const exerciseError = state.app.exercise.error
  return {
    exercise,
    exerciseError,
    loading: !exercise && !exerciseError,
    session: state.app.session
  }
}

const isFinished = pathOr(false, ['exercise', 'isFinished'])

export const Exercise = compose(
  withRouter,
  connect(mapStateToProps, {
    openExerciseResultModal,
    getPublicExerciseAction,
    unloadExerciseAction
  })
)(
  class ExerciseComponent extends React.Component {
    componentWillMount() {
      const { match, getPublicExerciseAction, previewMode } = this.props

      if (!previewMode) {
        getPublicExerciseAction(match.params.key)
      }
    }

    componentWillReceiveProps(nextProps) {
      if (isFinished(nextProps) && !isFinished(this.props)) {
        this.props.openExerciseResultModal({ success: true, onClose: this.closeResultModal })
      }
    }

    componentWillUnmount() {
      const { unloadExerciseAction, previewMode } = this.props

      if (!previewMode) {
        unloadExerciseAction()
      }
    }

    closeResultModal = res => {
      switch (res) {
        case 'back':
          return this.props.history.goBack()
        case 'retry':
          return
      }
    }

    render() {
      const { loading, exerciseError } = this.props

      if (loading) {
        return <Loading />
      } else if (exerciseError) {
        return this.renderError()
      } else {
        return this.renderExercise()
      }
    }

    renderExercise() {
      const ex = this.props.exercise
      const subTaskList = pairsInOrder(ex.subTasks)
      const isSingleTask = subTaskList.length === 1
      const subTasks = subTaskList.filter(([_, task]) => task.status !== TASK_STATUS_WAITING)

      return (
        <div className="row">
          <div className="col-md-8 col-sm-10 mx-auto my-3">
            {!isSingleTask && (
              <ProgressBar className="my-3" value={ex.finishedTasks / ex.allTasks * 100} />
            )}

            <Markdown source={ex.description} resources={ex.resources} />

            {subTasks.map(([taskId, task]) =>
              this.renderSubTask(ex._key, taskId, task, isSingleTask, ex.resources)
            )}
          </div>
        </div>
      )
    }

    renderSubTask(exId, taskId, task, isSingleTask, resources) {
      return (
        <div className="row" key={taskId}>
          <div className="col-1">{isSingleTask ? '' : `${abcIndex(task.order)})`}</div>
          <div className="col-10">
            <SubTask exerciseId={exId} id={taskId} task={task} resources={resources} />
          </div>
        </div>
      )
    }

    renderError() {
      const error = this.props.exerciseError

      return (
        <div className="col-10 mx-auto">
          <div className="alert alert-danger  my-4">
            <h3>Sajnos nem várt hiba történt :(</h3>
            <div className="text-muted m-3">
              {error.message || JSON.stringify(error, null, 3)}
            </div>
          </div>
          <NavLink exact to="/" className="btn btn-secondary">
            Vissza a főoldalra
          </NavLink>
        </div>
      )
    }
  }
)
