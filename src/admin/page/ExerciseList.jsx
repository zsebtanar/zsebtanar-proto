import React from 'react'
import { connect } from 'react-redux'
import { getAllExerciseAction, removeExerciseAction } from '../../store/actions/exercise'
import { NavLink } from 'react-router-dom'
import Button from '../../shared/component/general/Button'

const mapStateToProps = (state) => ({
  exercises: state.exercise.list
})

export default connect(
  mapStateToProps,
  {getAllExerciseAction, removeExerciseAction}
)(class extends React.Component {
  componentWillMount () {
    this.props.getAllExerciseAction()
  }

  removeExercise = (key) => () => {
    if (confirm('Biztos, hogy törlöd a feladatot?')) {
      this.props.removeExerciseAction(key)
        .then(this.props.getAllExerciseAction)
    }
  }

  render () {
    return (
      <div>
        <div className="btn-toolbar justify-content-between align-items-center">
          <h3>Feladatok</h3>
          <NavLink exact to="/exercise/add" className="btn btn-secondary btn-sm">
            <i className="fa fa-plus"/> Feladat létrehozása
          </NavLink>
        </div>
        <table className="table table-hover table mt-3">
          <thead>
          <tr>
            <th>#</th>
            <th>Osztály</th>
            <th>Tantárgy</th>
            <th>Témakör</th>
            <th>Cím</th>
            <th>Címkék</th>
            <th>Létrehozva</th>
            <th className="text-center"><i className="fa fa-lg fa-cog"/></th>
          </tr>
          </thead>
          <tbody>
          {this.props.exercises ? this.renderItem() : 'Kis türelmet...'}
          </tbody>
        </table>
      </div>
    )
  }

  renderItem () {
    return this.props.exercises.map((ex, idx) =>
      <tr key={ex._key}>
        <td>{idx + 1}</td>
        <td>{ex.classification.grade}</td>
        <td>{ex.classification.subject}</td>
        <td>{ex.classification.topic}</td>
        <td>{ex.title}</td>
        <td>{ex.classification.tags}</td>
        <td>{new Date(ex._created).toLocaleDateString()}</td>
        <td className="text-center">
          <NavLink exact to={`/exercise/view/${ex._key}`} className="btn btn-sm btn-secondary" title="Megtekintés">
            <i className="fa fa-eye"/>
          </NavLink>
          &nbsp;
          <NavLink exact to={`/exercise/edit/${ex._key}`} className="btn btn-sm btn-secondary" title="Feladat szerkesztése">
            <i className="fa fa-edit"/>
          </NavLink>
          &nbsp;
          <NavLink exact to={`/exercise/add/${ex._key}`} className="btn btn-sm btn-secondary" title="Feladat másolása">
            <i className="fa fa-clone"/>
          </NavLink>
          &nbsp;
          <Button title="Feladat törlése" className="btn btn-sm btn-secondary" onAction={this.removeExercise(ex._key)}>
            <span className="text-danger"><i className="fa fa-trash"/></span>
          </Button>
        </td>
      </tr>
    )
  }
})
