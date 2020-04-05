import * as React from 'react'
import { getReward } from 'client-common/services/rewards'
import { Loading } from 'client-common/component/general/Loading'
import { getPublicExercise } from 'client-common/services/exercise'
import { Markdown } from 'client-common/component/general/Markdown'
import { NavLink } from 'react-router-dom'

//TODO: React.PureComponent<AllProps>

export interface RewardProps {
  match?
}

export interface RewardState {
  reward?
  exercises?
}

export class Reward extends React.Component<RewardProps, RewardState> {
  constructor(props: RewardProps) {
    super(props)

    this.state = {
      reward: {},
      exercises: []
    }
  }

  _isMounted = false

  async componentDidMount() {
    this._isMounted = true
    const id = this.props.match.params.reward
    const reward = await getReward(id)

    if (this._isMounted) {
      this.setState({ reward })

      const exercises = []
      const sC = reward.additionalInfo.shouldComplete
      for (let i = 0; i < sC.length; i++) {
        const exercise = await getPublicExercise(sC[i])
        exercises.push(exercise)
      }

      this.setState({ exercises })
    }
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    const { reward, exercises } = this.state
    if (!reward.name)
      return (
        <div className="my-5 m-auto">
          <Loading />
        </div>
      )
    return (
      <div className="text-center">
        <img
          src="/assets/images/trophy-empty.svg"
          width="200px"
          height="200px"
          className="m-2"
        />
        <table className="table text-left">
          <tbody>
            <tr>
              <td>Jutalom neve</td>
              <td>{reward.name}</td>
            </tr>
            <tr>
              <td>Kategória</td>
              <td>{reward.trophy}</td>
            </tr>
            <tr>
              <td>Leírás</td>
              <td>{reward.description}</td>
            </tr>
          </tbody>
        </table>
        {exercises.length > 0 && <h6>A megszerzéséhez szükséges feladatok:</h6>}
        <div className="list-group col-md-10 col-sm -12 mx-auto">
          {exercises.length > 0 &&
            exercises.map(ex => (
              <NavLink
                key={ex._key}
                to={`/exercise/${ex._key}`}
                className="list-group-item list-group-item-action d-flex flex-column align-items-start"
              >
                <div className="mb-1 d-flex w-100 ">
                  <Markdown source={ex.description} resources={ex.resources} />
                </div>
              </NavLink>
            ))}
        </div>
        <NavLink to="/rewards" className="m-2">
          Vissza
        </NavLink>
      </div>
    )
  }
}
