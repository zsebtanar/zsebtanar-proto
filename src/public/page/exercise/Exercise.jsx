import { compose, pathOr } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { abcIndex, pairsInOrder } from 'shared/util/fn'
import Markdown from 'shared/component/general/Markdown'
import { openExerciseResultModal } from 'shared/store/actions/modal'
import { withRouter } from 'react-router-dom'
import Loading from 'shared/component/general/Loading'
import { SubTask } from 'public/page/exercise/SubTask'
import { getPublicExerciseAction, unloadExerciseAction, TASK_STATUS_WAITING } from 'public/store/exercise'
import { ProgressBar } from 'shared/ui/Progress'

const mapStateToProps = state => ({
  session: state.app.session,
  exercise: state.exercise.item,
  loading: !state.exercise.item
})

const isFinished = pathOr(false, ['exercise', 'isFinished'])

export const Exercise = compose(
  withRouter,
  connect(mapStateToProps, { openExerciseResultModal, getPublicExerciseAction, unloadExerciseAction })
)(
  class ExerciseComponent extends React.Component {
    componentWillMount() {
      const { match, getPublicExerciseAction } = this.props

      getPublicExerciseAction(match.params.key)
    }

    componentWillReceiveProps(nextProps) {
      if (isFinished(nextProps) && !isFinished(this.props)) {
        this.props.openExerciseResultModal({success: true, onClose: this.closeResultModal})
      }
    }

    componentWillUnmount() {
      this.props.unloadExerciseAction()
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
      const { loading } = this.props

      return loading ? <Loading /> : this.renderExercise()
    }

    renderExercise() {
      const ex = this.props.exercise
      const subTaskList = pairsInOrder(ex.subTasks)
      const isSingleTask = subTaskList.length === 1
      const subTasks = subTaskList.filter(([_, task]) => task.status !== TASK_STATUS_WAITING)

      return (
        <div className="row">
          <div className="col-8 mx-auto my-5">
            {!isSingleTask && (
              <ProgressBar className="my-3" value={ex.finishedTasks / ex.allTasks * 100} />
            )}

            <Markdown source={ex.description} />

            {subTasks.map(([taskId, task]) =>
              this.renderSubTask(ex._key, taskId, task, isSingleTask)
            )}
          </div>
        </div>
      )
    }

    renderSubTask(exId, taskId, task, isSingleTask) {
      return (
        <div className="row" key={taskId}>
          <div className="col-1">{isSingleTask ? '' : `${abcIndex(task.order)})`}</div>
          <div className="col-10">
            <SubTask exerciseId={exId} id={taskId} task={task} />
          </div>
        </div>
      )
    }
  }
)
