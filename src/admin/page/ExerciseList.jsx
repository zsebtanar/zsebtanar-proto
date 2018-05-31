import React from 'react'
import { evolve, map, pathOr, values } from 'ramda'
import { NavLink } from 'react-router-dom'
import { getAllClassification, GRADE, SUBJECT, TAGS, TOPIC } from 'shared/services/classification'
import { getAllPrivateExercises } from 'shared/services/exercise'
import { Loading } from 'shared/component/general/Loading'
import { ExerciseState } from '../components/ExerciseState'
import { Icon } from 'shared/component/general/Icon'

export class ExerciseList extends React.Component {
  state = {
    exercises: null
  }

  loadList = () => {
    Promise.all([getAllClassification(), getAllPrivateExercises()]).then(
      ([classifications, list]) => {
        const topics = values(classifications[SUBJECT]).reduce(
          (acc, sub) => Object.assign(acc, sub[TOPIC]),
          {}
        )
        this.setState({
          exercises: list.map(
            evolve({
              classification: {
                grade: map(key => pathOr(key, [GRADE, key, 'name'], classifications)),
                subject: map(key => pathOr(key, [SUBJECT, key, 'name'], classifications)),
                topic: map(key => pathOr(key, [key, 'name'], topics)),
                tags: map(key => pathOr(key, [TAGS, key, 'name'], classifications))
              }
            })
          )
        })
      }
    )
  }

  componentWillMount() {
    this.loadList()
  }

  render() {
    return (
      <div>
        <div className="btn-toolbar justify-content-between align-items-center">
          <h3>Feladatok</h3>
          <NavLink exact to="/exercise/add" className="btn btn-outline-secondary">
            <i className="fa fa-plus" /> Feladat létrehozása
          </NavLink>
        </div>
        {this.state.exercises ? (
          <table className="table table-hover table mt-3 exercise-list-table">
            <thead>
              <tr>
                <th>#</th>
                <th title="Státusz">@</th>
                <th>Osztály</th>
                <th>Tantárgy</th>
                <th>Témakör</th>
                <th>Cím</th>
                <th>Címkék</th>
                <th className="text-center action-column">
                  <i className="fa fa-lg fa-cog" />
                </th>
              </tr>
            </thead>
            <tbody>{this.renderItem()}</tbody>
          </table>
        ) : (
          <Loading />
        )}
      </div>
    )
  }

  renderItem() {
    return this.state.exercises.map((ex, idx) => (
      <tr key={ex._key}>
        <td>{idx + 1}</td>
        <td>
          <ExerciseState value={ex._state} short />
        </td>
        <td className="grade-column">
          {pathOr([], ['classification', 'grade'], ex).map(x => (
            <span className="seq" key={x}>
              {' '}
              {x}
            </span>
          ))}
        </td>
        <td>
          {pathOr([], ['classification', 'subject'], ex).map(x => (
            <span className="seq" key={x}>
              {' '}
              {x}
            </span>
          ))}
        </td>
        <td>
          {pathOr([], ['classification', 'topic'], ex).map(x => (
            <span className="seq" key={x}>
              {' '}
              {x}
            </span>
          ))}
        </td>
        <td>{ex.title}</td>
        <td>
          {pathOr([], ['classification', 'tags'], ex).map(tag => (
            <span className="badge badge-secondary mx-1" key={tag}>
              {tag}
            </span>
          ))}
        </td>
        <td className="text-right">
          <NavLink
            exact
            to={`/exercise/view/${ex._key}`}
            className="btn btn-sm btn-light"
            title="Megtekintés"
          >
            <Icon fa="eye" />
          </NavLink>
          &nbsp;
          <NavLink
            exact
            to={`/exercise/add/${ex._key}`}
            className="btn btn-sm btn-light"
            title="Feladat másolása"
          >
            <Icon fa="clone" />
          </NavLink>
          &nbsp;
          <NavLink
            exact
            to={`/exercise/edit/${ex._key}`}
            className="btn btn-sm btn-light"
            title="Feladat szerkesztése"
          >
            <Icon fa="edit" />
          </NavLink>
        </td>
      </tr>
    ))
  }
}
