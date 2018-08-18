import * as React from 'react'
import { pathOr, pipe } from 'ramda'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import { abcIndex, pairsInOrder } from 'shared/util/fn'
import { Markdown } from 'client-common/component/general/Markdown'
import { Loading } from 'client-common/component/general/Loading'
import { SubTask } from 'client-common/page/exercise/SubTask'
import { getPublicExerciseAction, TASK_STATUS_WAITING, unloadExerciseAction } from 'client-common/store/exercise'
import { ProgressBar } from 'client-common/component/general/Progress'
import { Button } from '../../component/general/Button'
import { withTracker } from '../../component/hoc/withTracker'

import './Exercise.scss'

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

const mapDispatchToProps = {
  getPublicExerciseAction,
  unloadExerciseAction
}

const isFinished = pathOr(false, ['exercise', 'isFinished'])

export const Exercise = pipe(
  withTracker,
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(
  class extends React.Component<any, any> {
    componentDidMount() {
      const { match, getPublicExerciseAction, previewMode } = this.props

      if (!previewMode) {
        getPublicExerciseAction(match.params.key)
      }
    }

    componentWillUnmount() {
      const { unloadExerciseAction, previewMode } = this.props

      if (!previewMode) {
        unloadExerciseAction()
      }
    }

    historyBack = () => this.props.history.goBack()

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

    private renderExercise() {
      const ex = this.props.exercise
      const subTaskList = pairsInOrder(ex.subTasks)
      const isSingleTask = subTaskList.length === 1
      const subTasks = subTaskList.filter(([_, task]) => task.status !== TASK_STATUS_WAITING)

      return (
        <div className="exercise-page">
          <div className="exercise-header">
            <div className="container d-flex align-items-center flex-row">
              <Button className="close" onAction={this.historyBack}>
                <span aria-hidden="true">&times;</span>
              </Button>
              {!isSingleTask && (
                <ProgressBar
                  className="w-100 mx-4"
                  value={(ex.finishedTasks / ex.allTasks) * 100}
                />
              )}
            </div>
          </div>

          <div className="container exercise-body">
            <div className="row">
              <div className="col-lg-8 col-md-10 mx-auto my-3">
                <Markdown
                  className="main-description mb-3"
                  source={ex.description}
                  resources={ex.resources}
                />

                {subTasks.map(([taskId, task], idx) =>
                  this.renderSubTask(idx, ex._key, taskId, task, isSingleTask, ex.resources)
                )}
              </div>
            </div>
          </div>
          {this.renderResult()}
        </div>
      )
    }

    private renderSubTask(idx, exId, taskId, task, isSingleTask, resources) {
      return (
        <div className="row" key={taskId}>
          <div className="sub-task-index col-md-1 mb-1 font-weight-bold">
            {isSingleTask ? '' : `${abcIndex(task.order)})`}
          </div>
          <div className="col-md-10">
            <SubTask
              exerciseId={exId}
              id={taskId}
              task={task}
              resources={resources}
              isFirst={idx === 0}
            />
          </div>
        </div>
      )
    }

    private renderError() {
      const error = this.props.exerciseError

      return (
        <div className="col-10 mx-auto">
          <div className="alert alert-danger  my-4">
            <h3>Sajnos nem várt hiba történt :(</h3>
            <div className="text-muted m-3">{error.message || JSON.stringify(error, null, 3)}</div>
          </div>
          <NavLink exact to="/" className="btn btn-secondary">
            Vissza a főoldalra
          </NavLink>
        </div>
      )
    }

    private renderResult() {
      if (isFinished(this.props)) {
        return (
          <div className="exercise-result">
            <div className="container">
              <p className="my-3 text-success">
                <i className="fa fa-check fa-lg" /> Gratuláunk! Sikeresen megoldottad a feldatot.
              </p>
              <Button className="btn btn-secondary btn-lg btn-block" onAction={this.historyBack}>
                <i className="fa fa-chevron-left" /> Vissza a feladat listához
              </Button>
            </div>
          </div>
        )
      }
    }
  }
)
