import * as React from 'react'
import { connect } from 'react-redux'
import { assocPath, last, propOr } from 'ramda'
import { pairsInOrder } from 'shared/util/fn'
import { UserControls } from 'client-common/component/userControls/UserControl'
import { Markdown } from 'client-common/component/general/Markdown'
import {
  checkSolutionAction,
  getHintAction,
  TASK_STATUS_DONE,
  TASK_STATUS_PREVIEW
} from 'client-common/store/exercise'
import { Button } from 'client-common/component/general/Button'
import { Icon } from 'client-common/component/general/Icon'

interface SubTaskProps {
  id: string
  exerciseId: string
  task: state.SubTask
  resources: MarkdownResources
}
interface SubTaskStateProps {
  isDone: boolean
}

interface SubTaskDispatchProps {
  getHintAction: typeof getHintAction
  checkSolutionAction: typeof checkSolutionAction
}

interface SubTaskState {
  loadingHint: boolean
  loadingCheck: boolean
  checkCounter: number
  solutions: DB.UserControlSolution
}

function mapStateToProps(state, ownProps) {
  return {
    isDone:
      ownProps.task.status === TASK_STATUS_DONE || ownProps.task.status === TASK_STATUS_PREVIEW
  }
}

export const SubTask = connect<SubTaskStateProps, SubTaskDispatchProps, SubTaskProps>(
  mapStateToProps,
  { getHintAction, checkSolutionAction }
)(
  class SubTaskComponent extends React.Component<
    SubTaskProps & SubTaskStateProps & SubTaskDispatchProps,
    SubTaskState
  > {
    state = {
      loadingHint: false,
      loadingCheck: false,
      checkCounter: 0,
      solutions: {}
    }

    componentDidMount() {
      if (!this.props.isDone) {
        document.addEventListener('keypress', this.onKeyPress)
      }
    }

    componentWillUnmount() {
      document.removeEventListener('keypress', this.onKeyPress)
    }

    private onKeyPress = event => {
      if (!this.props.isDone && event.keyCode === 13) {
        this.checkSolution(event)
      }
    }

    private getHint = () => {
      const { exerciseId, id, getHintAction, task } = this.props
      this.setState({ loadingHint: true })
      // TODO: remove promise return and use redux store
      getHintAction(exerciseId, id, propOr(exerciseId, 'key', last(task.hints || []))).then(() =>
        this.setState({ loadingHint: false })
      )
    }

    private checkSolution = e => {
      e.preventDefault()

      const { exerciseId, id, checkSolutionAction } = this.props
      this.setState({ loadingCheck: true })
      checkSolutionAction(exerciseId, id, this.state.solutions).then(() =>
        this.setState({ loadingCheck: false, checkCounter: this.state.checkCounter + 1 })
      )
    }

    private onChange = ({ name, value }) => this.setState(assocPath(['solutions', name], value))

    private registerRef = ref => {
      ref.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
    }

    render() {
      const { task, isDone } = this.props
      const { loadingHint, loadingCheck } = this.state
      const hints = task.hints
      const controls = pairsInOrder(task.details.controls)
      const className = `exercise-sub-task ${isDone ? 'finished' : ''}`

      return (
        <div className={className} ref={this.registerRef}>
          {this.renderDescription()}
          {!isDone && <div className="form-group hints">{hints && hints.map(this.renderHint)}</div>}

          <form onSubmit={this.checkSolution}>
            {controls.map(this.renderControl)}

            {!isDone && (
              <div className="exercise-footer">
                <div className="container ">
                  {this.state.checkCounter > 0 &&
                    task.hintsLeft > 0 && (
                      <Button
                        className="btn-link"
                        onAction={this.getHint}
                        loading={loadingHint}
                        disabled={loadingCheck}
                      >
                        Kérek segítséget ({task.hintsLeft} maradt)
                      </Button>
                    )}

                  <Button
                    submit
                    loading={loadingCheck}
                    disabled={loadingHint}
                    className="btn btn-secondary btn-lg"
                  >
                    <Icon fa="check" /> Ellenőrzés
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      )
    }

    private renderDescription() {
      const desc = this.props.task.details.description
      return desc && <Markdown className="" source={desc} resources={this.props.resources} />
    }

    private renderControl = ([ctrlId, { controlType, controlProps }]) => {
      const value = this.state.solutions[ctrlId]
      const readOnly = this.props.task.validity[ctrlId]
      const isDone = this.props.task.status === TASK_STATUS_DONE

      const props = {
        controlType,
        value,
        controlProps: {
          ...controlProps,
          name: ctrlId,
          readOnly,
          onChange: this.onChange
        }
      }

      if (isDone) {
        return (
          <div className="form-group user-control-row" key={ctrlId}>
            <UserControls {...props} resources={this.props.resources} />
          </div>
        )
      } else {
        return (
          <div className="form-group user-control-row" key={ctrlId}>
            {this.resultIcon(ctrlId)}
            <UserControls {...props} resources={this.props.resources} />
          </div>
        )
      }
    }

    private renderHint = item => (
      <div className="mb-2" key={item.key}>
        <Markdown source={item.hint.text} resources={this.props.resources} />
      </div>
    )

    private resultIcon = ctrlId => {
      const validity = this.props.task.validity[ctrlId]
      if (validity === true)
        return (
          <span className="text-success float-right">
            <Icon fa="check" size="2x" />
          </span>
        )
      if (validity === false)
        return (
          <span className="text-danger float-right">
            <Icon fa="times" size="2x" />
          </span>
        )
    }
  }
)
