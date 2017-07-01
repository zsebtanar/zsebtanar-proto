import React from 'react'
import {connect} from 'react-redux'
import {checkSolutionAction, getExerciseAction} from '../store/actions/exercise'
import {NavLink} from 'react-router-dom'
import Markdown from '../component/general/Markdown'
import UserControls from '../component/userControls/UserControl'
import {values, pathOr} from 'ramda'

const mapStateToProps = (state) => ({
  exercise: state.exercise.active
})

export default connect(mapStateToProps, {getExerciseAction, checkSolutionAction})
(class extends React.Component {
  state = {
    solutions: [],
    details: false
  }

  componentWillMount() {
    this.props.getExerciseAction(this.props.match.params.key)
  }

  onSubmit = (event) => {
    event.preventDefault()
    this.props.checkSolutionAction(
      this.props.exercise.details._key,
      this.state.solutions
    )
  }

  onChange = (event) => {
    const solutions = this.state.solutions.slice()
    solutions[parseInt(event.name, 10)] = event.value
    this.setState({solutions})
  }

  toggleDetails = () => {
    this.setState({details: !this.state.details})
  }

  render() {
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center">
          <h2>Exercise <small>{pathOr('', ['exercise', 'details', 'title'], this.props)}</small></h2>
          <NavLink exact to="/exercise">Cancel</NavLink>
        </div>
        <hr/>
        {
          !this.props.exercise
            ? 'loading...'
            :<div className="row">
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

  renderDetails(){
    const ex = this.props.exercise.details

    return (
      this.state.details
        ? <div>
          <button type="button" className="btn btn-sm btm-secondary" onClick={this.toggleDetails}>Hide exercise details</button>
          <pre>{JSON.stringify(ex, null, 3)}</pre>
        </div>
        :<button type="button" className="btn btn-sm btm-secondary" onClick={this.toggleDetails}>Show exercise details</button>
    )
  }

  renderTask() {
    const ex = this.props.exercise.details
    const cx = {
      'in-progress': 'badge badge-default',
      'fail': 'badge badge-danger',
      'success': 'badge badge-success'
    }[this.props.exercise.state]

    return (<form onSubmit={this.onSubmit}>
      <div className="">
        Exercise state: <span className={cx}>{this.props.exercise.state}</span> <code>({JSON.stringify(this.props.exercise.validity)})</code>
      </div>

      <hr/>

      <Markdown source={ex.description}/>

      {
        (values(ex.controls) || []).map(({controlType, controlProps, order}) =>
          <UserControls key={controlType} {...{controlType, controlProps: {...controlProps, name: order, onChange: this.onChange}}}/>
        )
      }

      <button type="submit" className="btn btn-primary">Submit</button>

    </form>)
  }
})