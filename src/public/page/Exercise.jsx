import { all, last, pathOr, propOr, identity } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { pairsInOrder } from 'shared/util/fn'
import UserControls from 'shared/component/userControls/UserControl'
import Button from 'shared/component/general/Button'
import Markdown from 'shared/component/general/Markdown'
import { checkSolution, getHint, getPublicExercise } from 'shared/services/exercise'
import { ROLE_ADMIN } from 'shared/services/user'

const mapStateToProps = (state) => ({
  session: state.app.session
})

export default connect(
  mapStateToProps
)(class extends React.Component {
  state = {
    solutions: [],
    hints: [],
    hintsLeft: 0,
    details: false,
    exerciseState: 'unchecked'
  }

  onSubmit = (event) => {
    event.preventDefault()
    this.setState({exerciseState: 'in-progress', validity: {}})
    checkSolution(
      this.state.exercise._key,
      this.state.solutions
    ).then(res => {
      this.setState({
        exerciseState: all(identity, res.data.valid) ? 'success' : 'fail',
        validity: res.data
      })
    })
  }

  onChange = ({name, value}) => {
    this.setState({solutions: {...this.state.solutions, [name]: value}})
  }

  toggleDetails = () => {
    this.setState({details: !this.state.details})
  }

  getNextHint = () => {
    const _key = this.state.exercise._key
    const hints = this.state.hints
    getHint(_key, propOr(_key, 'key', last(hints || [])))
      .then((hint) => {
        const {hints, exercise} = this.state
        return this.setState({
          hints: hints.concat(hint),
          hintsLeft: (exercise.details.hintCount || 0) - (exercise.hints || []).length
        })
      })
  }

  componentWillMount () {
    getPublicExercise(this.props.match.params.key)
      .then(exercise => this.setState({exercise, hintsLeft: pathOr(0, ['details', 'intCount'], exercise)}))
  }

  render () {
    const ex = this.state.exercise
    return (
      <div>
        {!ex && 'Betöltés...'}
        {ex && ex.error && <div>
          <div className="alert alert-danger">{ex.error.message || ex.error}</div>
        </div>}
        {ex && !ex.error && <div className="row">
          <div className="col-8 mx-auto">
            {this.renderTask()}
            {this.renderDetails()}
          </div>
        </div>
        }
      </div>
    )
  }

  renderDetails () {
    const session = this.props.session
    if (!session.signedIn || (session.signedIn && session.userDetails.role < ROLE_ADMIN)) return

    const ex = this.state.exercise

    return (<div>
      <hr/>{
      this.state.details
        ? <div>
          <Button className="btn btn-link" onAction={this.toggleDetails}>Debug</Button>
          <pre>{JSON.stringify(ex, null, 3)}</pre>
        </div>
        : <Button className="btn btn-link" onAction={this.toggleDetails}>Debug</Button>
    }</div>
    )
  }

  renderTask () {
    const ex = this.state.exercise
    const cx = {
      'unchecked': 'badge badge-default',
      'in-progress': 'badge badge-default',
      'fail': 'badge badge-danger',
      'success': 'badge badge-success'
    }[this.state.exerciseState]
    const label = {
      'unchecked': 'Nem ellenőrzött',
      'in-progress': 'Ellenőrzése...',
      'fail': 'A megoldás hibás',
      'success': 'A megoldás helyes'
    }[this.state.exerciseState]

    const hints = this.state.hints || []

    return (<form onSubmit={this.onSubmit}>
      <div className="">
        Feladat ellenőrzés állapota: <span className={cx}>{label}</span>
        <code>({JSON.stringify(this.state.validity)})</code>
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
          hints && <ol>
              {hints.map(item => (<li key={item.key}>
                <Markdown source={item.hint.text}/>
              </li>))}
            </ol>
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
