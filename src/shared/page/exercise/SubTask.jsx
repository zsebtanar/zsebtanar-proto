import React from 'react'
import { propOr, last, assocPath } from 'ramda'
import { abcIndex, pairsInOrder } from 'shared/util/fn'
import UserControls from 'shared/component/userControls/UserControl'
import Markdown from 'shared/component/general/Markdown'
import Button from 'shared/component/general/Button'
import { connect } from 'react-redux'
import {
  checkSolutionAction,
  getHintAction,
  TASK_STATUS_DONE,
  TASK_STATUS_PREVIEW
} from 'shared/store/exercise'
import Icon from 'shared/component/general/Icon'

export const SubTask = connect(undefined, { getHintAction, checkSolutionAction })(
  class SubTaskComponent extends React.Component {
    state = {
      loadingHint: false,
      loadingCheck: false,
      solutions: {}
    }

    getHint = () => {
      const { exerciseId, id, getHintAction, task } = this.props
      this.setState({ loadingHint: true })
      getHintAction(exerciseId, id, propOr(exerciseId, 'key', last(task.hints || []))).then(() =>
        this.setState({ loadingHint: false })
      )
    }

    checkSolution = e => {
      e.preventDefault()

      const { exerciseId, id, checkSolutionAction } = this.props
      this.setState({ loadingCheck: true })
      checkSolutionAction(exerciseId, id, this.state.solutions).then(() =>
        this.setState({ loadingCheck: false })
      )
    }

    onChange = ({ name, value }) => this.setState(assocPath(['solutions', name], value))

    render() {
      const { task } = this.props
      const { loadingHint, loadingCheck } = this.state
      const isDone = task.status === TASK_STATUS_DONE || task.status === TASK_STATUS_PREVIEW
      const hints = task.hints || []
      const controls = pairsInOrder(task.details.controls)

      return (
        <div>
          {this.renderDescription()}

          <div className="form-group">
            {hints && <ol>{hints.map(this.renderHint)}</ol>}

            {!isDone &&
            task.hintsLeft > 0 && (
              <div className="form-group">
                <Button
                  className="btn-link"
                  onAction={this.getHint}
                  loading={loadingHint}
                  disabled={loadingCheck}
                >
                  Következő tipp (még {task.hintsLeft})
                </Button>
              </div>
            )}
          </div>

          <form onSubmit={this.checkSolution}>
            {controls.map(this.renderControl)}

            {!isDone && (
              <Button submit loading={loadingCheck} disabled={loadingHint}>
                <Icon fa="check" /> Ellenőrzés
              </Button>
            )}
          </form>
        </div>
      )
    }

    renderDescription() {
      const desc = this.props.task.details.description
      return desc && <Markdown source={desc} />
    }

    renderControl = ([ctrlId, { controlType, controlProps }]) => {
      const value = this.state.solutions[ctrlId]
      const readOnly = this.props.task.validity[ctrlId]
      const isDone = this.props.task.status === TASK_STATUS_DONE

      const props = {
        controlType,
        controlProps: {
          ...controlProps,
          name: ctrlId,
          value,
          readOnly,
          onChange: this.onChange
        }
      }

      if (isDone) {
        return (
          <div className="form-group row" key={ctrlId}>
            <UserControls {...props} />
          </div>
        )
      } else {
        return (
          <div className="form-group row" key={ctrlId}>
            <div className="col-1">{this.resultIcon(ctrlId)}</div>
            <div className="col-11">
              <UserControls {...props} />
            </div>
          </div>
        )
      }
    }

    renderHint = item => (
      <li key={item.key}>
        <Markdown source={item.hint.text} />
      </li>
    )

    resultIcon = ctrlId => {
      const validity = this.props.task.validity[ctrlId]
      if (validity === true)
        return (
          <span className="text-success">
            <Icon fa="check" size="2x" />
          </span>
        )
      if (validity === false)
        return (
          <span className="text-danger">
            <Icon fa="times" size="2x" />
          </span>
        )
    }
  }
)
