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
        <div className="text-right">
          <NavLink exact to="/exercise/add" className="btn btn-primary btn-sm">
            <i className="fa fa-plus"/> Add new exercise
          </NavLink>
        </div>
        <hr/>
        <table className="table table-hover table">
          <thead className="thead-default">
            <tr>
              <th>#</th>
              <th>Subject</th>
              <th>Topic</th>
              <th>Grade</th>
              <th>Tags</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.props.exercises ? this.renderItem() : 'Loading...'}
          </tbody>
        </table>
      </div>
    )
  }

  renderItem(){
    return this.props.exercises.map((ex, idx) =>
      <tr key={ex._key}>
        <td>{idx+1}</td>
        <td>{ex.classification.subject}</td>
        <td>{ex.classification.topic}</td>
        <td>{ex.classification.grade}</td>
        <td>{ex.classification.tags}</td>
        <td>{new Date(ex._created).toLocaleDateString()}</td>
        <td>
          <NavLink exact to={`/exercise/view/${ex._key}`} className="btn btn-sm" title="View">
            <i className="fa fa-lg fa-eye"/>
          </NavLink>
          {/*<NavLink exact to={`/exercise/edit/${ex._key}`} className="btn btn-sm">
            <i className="fa fa-lg fa-edit"/>
          </NavLink>*/}
        </td>
      </tr>
    )
  }
})