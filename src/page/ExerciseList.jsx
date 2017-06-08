import React from 'react'
import {connect} from 'react-redux'
import {getAllExerciseAction} from '../store/actions/exercise'
import {NavLink} from 'react-router-dom'

const mapStateToProps = (state) => ({
  exercises: state.exercise.list
})

export default connect(mapStateToProps, {getAllExerciseAction})
(class extends React.Component {
  componentWillMount() {
    this.props.getAllExerciseAction()
  }

  render() {
    return (
      <div>
        <h2>Exercises:</h2>
        <div>
          <NavLink exact to="/exercise-add" className="btn btn-primary">
            <i className="fa fa-plus"/> Add new exercise
          </NavLink>
        </div>
        <ul>
          {this.props.exercises ? this.renderItem() : 'Loading...'}
        </ul>
      </div>
    )
  }

  renderItem(){
    return this.props.exercises.map(ex =>
      <li key={ex._key}>
        <NavLink exact to={`/exercise/${ex._key}`}>{ex.subject}/{ex.topic}</NavLink>
      </li>
    )
  }
})