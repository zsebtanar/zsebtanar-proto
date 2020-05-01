import * as React from 'react'
import { evolve, map, pathOr, values } from 'ramda'
import { NavLink } from 'react-router-dom'
import { getAllClassification, GRADE, SUBJECT, TAGS, TOPIC } from 'client-common/services/classification'
import { getAllPrivateExercises } from 'client-common/services/exercise'
import { Loading } from 'client-common/component/general/Loading'
import { ExerciseState } from '../components/ExerciseState'
import { Icon } from 'client-common/component/general/Icon'
import { Button } from 'client-common/component/general/Button'
import { getRewards, addExerciseToReward } from 'client-common/services/rewards'
import { RewardSelector } from '../components/RewardSelector'

export class Exercises extends React.Component<any, any> {
  state = {
    exercises: null,
    rewards: [],
    selectedReward: null
  }

  loadList = () => {
    Promise.all([getAllClassification(), getAllPrivateExercises(), getRewards()]).then(
      ([classifications, list, rewards]) => {
        const topics = values(classifications[SUBJECT]).reduce(
          (acc, sub) => Object.assign(acc, sub[TOPIC]),
          {}
        )
        this.setState({
          exercises: list.map(
            evolve({
              classification: {
                grade: map(key => pathOr(key, [GRADE, key as string, 'name'], classifications)),
                subject: map(key => pathOr(key, [SUBJECT, key as string, 'name'], classifications)),
                topic: map(key => pathOr(key, [key as string, 'name'], topics)),
                tags: map(key => pathOr(key, [TAGS, key as string, 'name'], classifications))
              }
            })
          ),
          rewards
        })
      }
    )
  }

  componentWillMount() {
    this.loadList()
  }

  rewardSelected = reward => {
    this.setState({ selectedReward: reward })
  }

  addToReward = exerciseId => {
    addExerciseToReward(exerciseId, this.state.selectedReward._key)
      .then( _ => getRewards().then(rewards => {
        const selectedReward = rewards.find(r => r._key === this.state.selectedReward._key)
        this.setState({rewards, selectedReward})
      }))
      .catch(error => {
        console.error(error);
        window.alert("Sajnos a feladat mentése a jutalomhoz sikertelen. A hibaüzenet megtekintéséhez kérlek nyomd meg az F12-t.")
      })
  }

  render() {
    return (
      <div>
        <div className="btn-toolbar justify-content-between align-items-center">
          <h3>Feladatok</h3>
          <RewardSelector rewards={this.state.rewards} rewardSelected={this.rewardSelected} />
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
          &nbsp;
          <Button
            onAction={() => this.addToReward(ex._key)}
            disabled={!this.canDisplayAddRewardButton(ex)}
            className={`btn btn-sm btn-light`}
            title="Hozzáadás a kiválasztott jutalomhoz"
          >
            <Icon fa="trophy" />
          </Button>
        </td>
      </tr>
    ))
  }

  canDisplayAddRewardButton(ex): boolean {
    return this.isActiveExercise(ex._state) 
      && this.state.selectedReward 
      && this.state.selectedReward.additionalInfo 
      && !this.state.selectedReward.additionalInfo.shouldComplete.includes(ex._key)
  }

  isActiveExercise(exState) {
    return exState === 'active'
  }
}
