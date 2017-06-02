import React from 'react'
import {connect} from 'react-redux'
import {fetchAllExercise} from '../store/actions/exercise'
import {NavLink} from 'react-router-dom'

const mapStateToProps = (state) => ({
  exercises: state.exercise.list
})

export default connect(mapStateToProps, {fetchAllExercise})
(class extends React.Component {
  componentWillMount() {
    this.props.fetchAllExercise()
  }

  render() {
    return (
      <div>
        <h2>Exercises:</h2>
        <ul>
          {this.props.exercises ? this.renderItem() : 'Loading...'}
        </ul>
      </div>
    )
  }

  renderItem(){
    return this.props.exercises.map(ex =>
      <li key={ex._key}>
        <NavLink exact to={`/exercise/${ex._key}`}>{ex.description}</NavLink>
      </li>
    )
  }
})