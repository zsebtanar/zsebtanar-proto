import React from 'react'
import {connect} from 'react-redux'
import {checkSolutionAction, getExerciseAction} from '../store/actions/exercise'
import {NavLink} from 'react-router-dom'

const mapStateToProps = (state) => ({
  exercise: state.exercise.active
})

export default connect(mapStateToProps, {getExerciseAction, checkSolutionAction})
(class extends React.Component {
  componentWillMount() {
    this.props.getExerciseAction(this.props.match.params.key)
  }

  onSubmit = (event) => {
    event.preventDefault()
    this.props.checkSolutionAction(
      this.props.exercise.details._key,
      this.refs.solution.value
    )
  }

  render() {
    return (
      <div>
        <h2>
          <NavLink exact to="/exercise"><i className="fa fa-chevron-left "/></NavLink>
          Exercise
        </h2>

        {
          !this.props.exercise
            ? 'loading...'
            :<div className="row">
              <div className="col">{this.renderDetails()}</div>
              <div className="col">{this.renderTask()}</div>
            </div>
        }
      </div>
    )
  }

  renderDetails(){
    const ex = this.props.exercise.details

    return (<ul>
      <li><b>key</b>: {ex['_key']}</li>
      <li><b>created</b>: {new Date(ex['_created']).toLocaleDateString()}</li>
      <li><b>created</b>: {new Date(ex['_updated']).toLocaleDateString()}</li>
      <li><b>Subject</b> {ex['subject']}</li>
      <li><b>Topic</b> {ex['topic']}</li>
      <li><b>Class</b> {ex['class']}</li>
      <li><b>Tags</b> {ex['tags']}</li>
      <li><b>Description</b>: ...</li>
      <li><b>draft</b>: {ex['draft']}</li>
      <li><b>input-type</b> {ex['input']}</li>
      <li><b>solution</b>: {ex['solution']}</li>
    </ul>)
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
        Exercise state: <span className={cx}>{this.props.exercise.state}</span>
      </div>

      <hr/>

      <div dangerouslySetInnerHTML={{__html: ex.htmlDescription}}/>

      <div className="form-group">
        <input type="text" className="form-control" placeholder="Enter solution" ref="solution"/>
      </div>

      <button type="submit" className="btn btn-primary">Submit</button>

    </form>)
  }
})