import React from 'react'
import {connect} from 'react-redux'
import {getAllExerciseAction, removeExerciseAction} from '../store/actions/exercise'
import {NavLink} from 'react-router-dom'

const mapStateToProps = (state) => ({
  exercises: state.exercise.list
})

export default connect(mapStateToProps, {getAllExerciseAction, removeExerciseAction})
(class extends React.Component {
  componentWillMount() {
    this.props.getAllExerciseAction()
  }

  removeExercise = (key) => () => {
    if(confirm('Are you sure?')){
      this.props.removeExerciseAction(key)
        .then(this.props.getAllExerciseAction)
    }
  }

  render() {
    return (
      <div>
        <div className="btn-toolbar justify-content-between align-items-center">
          <h3>Exercise list</h3>
          <NavLink exact to="/exercise/add" className="btn btn-secondary btn-sm">
            <i className="fa fa-plus"/> Add new exercise
          </NavLink>
        </div>
        <table className="table table-hover table mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Subject</th>
              <th>Topic</th>
              <th>Grade</th>
              <th>Tags</th>
              <th>Created</th>
              <th className="text-center"><i className="fa fa-lg fa-cog"/></th>
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
        <td>{ex.title}</td>
        <td>{ex.classification.subject}</td>
        <td>{ex.classification.topic}</td>
        <td>{ex.classification.grade}</td>
        <td>{ex.classification.tags}</td>
        <td>{new Date(ex._created).toLocaleDateString()}</td>
        <td className="text-center">
          <NavLink exact to={`/exercise/view/${ex._key}`} className="btn btn-sm btn-secondary" title="View">
            <i className="fa fa-eye"/>
          </NavLink>
          &nbsp;
          <NavLink exact to={`/exercise/edit/${ex._key}`} className="btn btn-sm btn-secondary" title="Edit exercise">
            <i className="fa fa-edit"/>
          </NavLink>
          &nbsp;
          <NavLink exact to={`/exercise/add/${ex._key}`} className="btn btn-sm btn-secondary" title="Clone exercise">
            <i className="fa fa-clone"/>
          </NavLink>
          &nbsp;
          <button type="button" className="btn btn-sm btn-secondary" title="Remove exercise" onClick={this.removeExercise(ex._key)}>
            <span className="text-danger"><i className="fa fa-trash"/></span>
          </button>
        </td>
      </tr>
    )
  }
})