import React from 'react'
import { connect } from 'react-redux'
import { checkSolutionAction, getHintAction, getPublicExerciseAction } from '../store/actions/exercise'
import { NavLink } from 'react-router-dom'
import UserControls from '../component/userControls/UserControl'
import { last, pathOr, propOr } from 'ramda'
import { pairsInOrder } from '../util/fn'
import Button from '../component/general/Button'

const mapStateToProps = (state) => ({
  exercise: state.exercise.active
})

export default connect(
  mapStateToProps,
  {getPublicExerciseAction, checkSolutionAction, getHintAction}
)(class extends React.Component {
  state = {
    solutions: [],
    hints: [],
    hintsLeft: 0,
    details: false
  }

  componentWillMount () {
    this.props
      .getPublicExerciseAction(this.props.match.params.key)
      .then(ex => this.setState({hintsLeft: this.props.exercise.details.hintCount || 0}))
  }

  onSubmit = (event) => {
    event.preventDefault()
    this.props.checkSolutionAction(
      this.props.exercise.details._key,
      this.state.solutions
    )
  }

  onChange = ({name, value}) => {
    this.setState({solutions: {...this.state.solutions, [name]: value}})
  }

  toggleDetails = () => {
    this.setState({details: !this.state.details})
  }

  getNextHint = () => {
    const _key = this.props.exercise.details._key
    const hints = this.props.exercise.hints
    this.props.getHintAction(_key, propOr(_key, 'key', last(hints || [])))
      .then(() => this.setState({hintsLeft: (this.props.exercise.details.hintCount || 0) - (this.props.exercise.hints || []).length}))
  }

  render () {
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center">
          <h2>Exercise
            <small>{pathOr('', ['exercise', 'details', 'title'], this.props)}</small>
          </h2>
          <NavLink exact to="/exercise">Cancel</NavLink>
        </div>
        <hr/>
        {
          !this.props.exercise
            ? 'loading...'
            : <div className="row">
              <div className="col-8 offset-2">
                {this.renderTask()}
                <hr/>
                {this.renderDetails()}
              </div>
            </div>
        }
      </div>
    )
  }

  renderDetails () {
    const ex = this.props.exercise.details

    return (
      this.state.details
        ? <div>
          <button type="button" className="btn btn-sm btm-secondary" onClick={this.toggleDetails}>Hide exercise details
          </button>
          <pre>{JSON.stringify(ex, null, 3)}</pre>
        </div>
        : <button type="button" className="btn btn-sm btm-secondary" onClick={this.toggleDetails}>Show exercise
          details</button>
    )
  }

  renderTask () {
    const ex = this.props.exercise.details
    const cx = {
      'in-progress': 'badge badge-default',
      'fail': 'badge badge-danger',
      'success': 'badge badge-success'
    }[this.props.exercise.state]

    const hints = this.props.exercise.hints || []

    return (<form onSubmit={this.onSubmit}>
      <div className="">
        Exercise state: <span className={cx}>{this.props.exercise.state}</span>
        <code>({JSON.stringify(this.props.exercise.validity)})</code>
      </div>

      <hr/>

      <div dangerouslySetInnerHTML={{__html: ex.htmlDescription}}/>

      {
        (pairsInOrder(ex.controls)).map(([key, {controlType, controlProps, order}]) =>
          <div className="form-group " key={key}>
            <UserControls {...{controlType, controlProps: {...controlProps, name: key, onChange: this.onChange}}}/>
          </div>
        )
      }

      <div className="form-group">
        {
          hints
            ? <ol>
              {hints.map(item => (<li key={item.key}>{item.hint.text}</li>))}
            </ol>
            : ''
        }

        <div className="form-group">
          {
            this.state.hintsLeft > 0
              ? <Button className="btn-sm btn-info" onAction={this.getNextHint}>
                Next hint - {this.state.hintsLeft} hint(s) left
              </Button>
              : ''
          }
        </div>
      </div>

      <Button submit primary>Submit</Button>

    </form>)
  }
})
