import * as React from 'react'
import RewardCard from '../component/RewardCard'

import { getRewardsArray } from '../../client-common/services/rewards'

export interface RewardsProps {}

export interface RewardsState {
  //rewards: Array<{ id: string; name: string; dateOfAchieving: string; description: string }>
  /*rewards: Array<{
    id: number
    name: string
    description: string
    trophy: string
    imageURL: string
  }>*/
  rewards?
}

class Rewards extends React.Component<RewardsProps, RewardsState> {
  constructor(props: RewardsProps) {
    super(props)

    this.state = {
      rewards: []
    }
  }

  _isMounted = false

  async componentDidMount() {
    this._isMounted = true
    const rewards = await getRewardsArray()
    if (this._isMounted) this.setState({ rewards })
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    return (
      <div>
        <h1>Jutalmak</h1>
        <div className="row">
          {this.state.rewards.map(e => (
            <RewardCard
              key={e.id}
              id={e.id}
              name={e.name}
              description={e.description}
              imageURL={e.imageURL}
            />
          ))}
        </div>
      </div>
    )
  }
}

export default Rewards
