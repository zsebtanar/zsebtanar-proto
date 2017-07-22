import { values, evolve, map, pathOr } from 'ramda'
import React from 'react'
import { NavLink } from 'react-router-dom'
import Button from 'shared/component/general/Button'
import { getAllClassification, GRADE, SUBJECT, TAGS, TOPIC } from 'shared/services/classification'
import { getAllPrivateExercises, removeExercise } from 'shared/services/exercise'

export default class extends React.Component {
  state = {
    exercises: null
  }

  deleteExercise = (key) => () => {
    if (confirm('Biztos, hogy törlöd a feladatot?')) {
      removeExercise(key).then(this.loadList)
    }
  }

  componentWillMount () {
    this.loadList()
  }

  loadList = () => {
    Promise.all([
      getAllClassification(),
      getAllPrivateExercises()
    ]).then(([classifications, list]) => {
      const topics = values(classifications[SUBJECT]).reduce((acc, sub) => Object.assign(acc, sub[TOPIC]), {})
      this.setState({ exercises: list.map(evolve({
        classification: {
          grade: map(key => pathOr(key, [GRADE, key, 'name'], classifications)),
          subject: map(key => pathOr(key, [SUBJECT, key, 'name'], classifications)),
          topic: map(key => pathOr(key, [key, 'name'], topics)),
          tags: map(key => pathOr(key, [TAGS, key, 'name'], classifications))
        }
      }))})
    })
  }

  render () {
    return (
      <div>
        <div className="btn-toolbar justify-content-between align-items-center">
          <h3>Feladatok</h3>
          <NavLink exact to="/exercise/add" className="btn btn-secondary">
            <i className="fa fa-plus"/> Feladat létrehozása
          </NavLink>
        </div>
        <table className="table table-hover table mt-3 exercise-list-table">
          <thead>
          <tr>
            <th>#</th>
            <th>Osztály</th>
            <th>Tantárgy</th>
            <th>Témakör</th>
            <th>Cím</th>
            <th>Címkék</th>
            <th className="text-center action-column"><i className="fa fa-lg fa-cog"/></th>
          </tr>
          </thead>
          <tbody>
          {this.state.exercises ? this.renderItem() : 'Kis türelmet...'}
          </tbody>
        </table>
      </div>
    )
  }

  renderItem () {
    return this.state.exercises.map((ex, idx) =>
      <tr key={ex._key}>
        <td>{idx + 1}</td>
        <td className="grade-column">{ex.classification.grade.map(x => <span key={x}>{x}</span>)}</td>
        <td>{ex.classification.subject.map(x => <span key={x}> {x} </span>)}</td>
        <td>{(ex.classification.topic || []).map(x => <span key={x}> {x} </span>)}</td>
        <td>{ex.title}</td>
        <td>{ex.classification.tags.map(tag =>
          <span className="badge badge-default mx-1" key={tag}>{tag}</span>
        )}</td>
        <td className="text-center">
          <NavLink exact to={`/exercise/view/${ex._key}`} className="btn btn-sm btn-secondary" title="Megtekintés">
            <i className="fa fa-eye"/>
          </NavLink>
          &nbsp;
          <NavLink exact to={`/exercise/edit/${ex._key}`} className="btn btn-sm btn-secondary"
                   title="Feladat szerkesztése">
            <i className="fa fa-edit"/>
          </NavLink>
          &nbsp;
          <NavLink exact to={`/exercise/add/${ex._key}`} className="btn btn-sm btn-secondary" title="Feladat másolása">
            <i className="fa fa-clone"/>
          </NavLink>
          &nbsp;
          <Button title="Feladat törlése" className="btn btn-sm btn-secondary" onAction={this.deleteExercise(ex._key)}>
            <span className="text-danger"><i className="fa fa-trash"/></span>
          </Button>
        </td>
      </tr>
    )
  }
}
