import React from 'react'
import { connect } from 'react-redux'
import { checkSolutionAction, getHintAction, getPublicExerciseAction } from '../store/actions/exercise'
import { NavLink } from 'react-router-dom'
import UserControls from '../component/userControls/UserControl'
import { last, pathOr, propOr } from 'ramda'
import { pairsInOrder } from '../util/fn'
import Button from '../component/general/Button'
import Markdown from '../component/general/Markdown'

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
      .then(ex => this.setState({hintsLeft: pathOr(0, ['props', 'xercise', 'details', 'intCount'], this)}))
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
    const ex = this.props.exercise
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center">
          <h2>Feladat megtekintése
            <small>{pathOr('', ['exercise', 'details', 'title'], this.props)}</small>
          </h2>
          <NavLink exact to="/exercise">Vissza a feladatlistához</NavLink>
        </div>
        <hr/>
        {!ex && 'Betöltés...'}
        {ex && ex.error && <div>
          <div className="alert alert-danger">{ex.error.message || ex.error}</div>
          <NavLink exact to="/exercise" className="btn btn-secondary">Vissza a feladatlist</NavLink>
        </div>}
        {ex && !ex.error && <div className="row">
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
          <Button onAction={this.toggleDetails}>Feladat leíró elrejtése</Button>
          <pre>{JSON.stringify(ex, null, 3)}</pre>
        </div>
        : <Button onAction={this.toggleDetails}>Feladat leíró mutatása</Button>
    )
  }

  renderTask () {
    const ex = this.props.exercise.details
    const cx = {
      'in-progress': 'badge badge-default',
      'fail': 'badge badge-danger',
      'success': 'badge badge-success'
    }[this.props.exercise.state]
    const label = {
      'in-progress': 'Beküldésre vár...',
      'fail': 'A megoldás hibás',
      'success': 'A megoldás helyes'
    }[this.props.exercise.state]

    const hints = this.props.exercise.hints || []

    return (<form onSubmit={this.onSubmit}>
      <div className="">
        Feladat ellenőrzés állapota: <span className={cx}>{label}</span>
        <code>({JSON.stringify(this.props.exercise.validity)})</code>
      </div>

      <hr/>

      <Markdown source={ex.description}/>

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
              {hints.map(item => (<li key={item.key}>
                <Markdown source={item.hint.text}/>
              </li>))}
            </ol>
            : ''
        }

        <div className="form-group">
          {
            this.state.hintsLeft > 0
              ? <Button className="btn-sm btn-info" onAction={this.getNextHint}>
                Következő tipp - {this.state.hintsLeft} tipp van még
              </Button>
              : ''
          }
        </div>
      </div>

      <Button submit primary>Ellenőrzés</Button>

    </form>)
  }
})
