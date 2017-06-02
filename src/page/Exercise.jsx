import React from 'react'
import {connect} from 'react-redux'
import {fetchExercise} from '../store/actions/exercise'
import {NavLink} from 'react-router-dom'

const mapStateToProps = (state) => ({
  exercise: state.exercise.active
})

export default connect(mapStateToProps, {fetchExercise})
(class extends React.Component {
  componentWillMount() {
    this.props.fetchExercise(this.props.match.params.key)
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
            :
              <ul>
                <li><b>key</b>: {this.props.exercise['_key']}</li>
                <li><b>created</b>: {new Date(this.props.exercise['_created']).toLocaleDateString()}</li>
                <li><b>description</b>: {this.props.exercise['description']}</li>
                <li><b>draft</b>: {this.props.exercise['draft']}</li>
                <li><b>input-type</b> {this.props.exercise['input']}</li>
                <li><b>math-topic</b> {this.props.exercise['math']}</li>
                <li><b>solution</b>: {this.props.exercise['solution']}</li>
                <li><b>tags</b>: {this.props.exercise['tags']}</li>
              </ul>
        }
      </div>
    )
  }
})