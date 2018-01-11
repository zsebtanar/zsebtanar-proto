import { compose } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { pairsInOrder } from 'shared/util/fn'
import Markdown from 'shared/component/general/Markdown'
import { openExerciseResultModal, openSignInModal } from 'shared/store/actions/modal'
import { withRouter } from 'react-router-dom'
import Loading from 'shared/component/general/Loading'
import { SubTask } from 'public/page/exercise/SubTask'
import { getPublicExerciseAction } from 'public/store/exercise'

const mapStateToProps = state => ({
  session: state.app.session,
  exercise: state.exercise.item,
  loading: !state.exercise.item
})

export const Exercise = compose(
  withRouter,
  connect(mapStateToProps, { openSignInModal, openExerciseResultModal, getPublicExerciseAction })
)(
  class ExerciseComponent extends React.Component {
    componentWillMount() {
      const { match, getPublicExerciseAction } = this.props

      getPublicExerciseAction(match.params.key)
    }

    render() {
      const { loading } = this.props

      return loading ? <Loading /> : this.renderExercise()
    }

    renderExercise() {
      const ex = this.props.exercise
      const subTasks = pairsInOrder(ex.subTasks)

      return (
        <div className="row">
          <div className="col-8 mx-auto my-5">
            <Markdown source={ex.description} />

            {subTasks.map(([taskId, task]) => (
              <SubTask key={taskId} exerciseId={ex._key} id={taskId} task={task} />
            ))}
          </div>
        </div>
      )
    }
  }
)
