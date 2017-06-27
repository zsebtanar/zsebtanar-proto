import React from 'react'
import {connect} from 'react-redux'
import {checkSolutionAction, getExerciseAction} from '../store/actions/exercise'
import {NavLink} from 'react-router-dom'
import Markdown from '../component/general/Markdown'
import SingleChoice from '../component/input/SingleChoice'
import SingleChoiceAdmin from '../component/input/SingleChoiceAdmin'

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
        <div className="d-flex justify-content-between align-items-center">
          <h2>Exercise</h2>
          <NavLink exact to="/exercise">Cancel</NavLink>
        </div>
        <hr/>
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
      <li><b>Subject</b> {ex.classification['subject']}</li>
      <li><b>Topic</b> {ex.classification['topic']}</li>
      <li><b>Grade</b> {ex.classification['grade']}</li>
      <li><b>Tags</b> {ex.classification['tags']}</li>
      <li><b>Description</b>: ...</li>
      <li><b>draft</b>: {ex['draft']}</li>
      <li><b>input-type</b> {ex['inputType']}</li>
      <li><b>solution</b>: {JSON.stringify(ex['solution'], null, 3)}</li>
      <li><b>created</b>: {new Date(ex['_created']).toLocaleDateString()}</li>
      <li><b>Updated</b>: {new Date(ex['_updated']).toLocaleDateString()}</li>
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

      <Markdown source={ex.description}/>

      <div className="form-group">
        <input type="text" className="form-control" placeholder="Enter solution" ref="solution"/>
      </div>

      <SingleChoice options={ex.solution.items} />

      <button type="submit" className="btn btn-primary">Submit</button>

    </form>)
  }
})