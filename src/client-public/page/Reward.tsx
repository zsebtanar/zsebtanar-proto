import * as React from 'react'
import { getReward } from '../../client-common/services/rewards'

//TODO: React.PureComponent<AllProps>

export interface RewardProps {
  match?
}

export interface RewardState {
  reward?
}

export class Reward extends React.Component<RewardProps, RewardState> {
  constructor(props: RewardProps) {
    super(props)

    this.state = {
      reward: {}
    }
  }

  _isMounted = false

  async componentDidMount() {
    this._isMounted = true
    const id = this.props.match.params.reward
    const reward = await getReward(id)
    console.log(reward)

    if (this._isMounted) this.setState({ reward })
  }

  componentWillUnmount() {
    this._isMounted = false
    console.log('unmount')
  }

  render() {
    //if (!this.state.reward) return null
    console.log(this.state.reward)
    return (
      <div className="text-center">
        <img
          src="https://image.flaticon.com/icons/svg/420/420105.svg"
          width="200px"
          height="200px"
          className="m-2"
        />
        <table className="table text-left">
          <tbody>
            <tr>
              <td>Jutalom neve</td>
              <td />
            </tr>
            <tr>
              <td>Megszerzési idő</td>
              <td>2020. 04. 04.</td>
            </tr>
            <tr>
              <td>Kategória</td>
              <td>Trófea</td>
            </tr>
          </tbody>
        </table>
        <p>Ide jön majd a jutalom leírása.</p>
      </div>
    )
  }
}
