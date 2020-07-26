import * as React from 'react'
import { Loading } from 'client-common/component/general/Loading'

import { getRewardsArray } from 'client-common/services/rewards'
import EditRewardCard from '../components/EditRewardCard'

export interface EditRewardsProps {
}

export interface EditRewardsState {
  rewards?
}

export default class EditRewards extends React.Component<EditRewardsProps, EditRewardsState> {
  constructor(props: EditRewardsProps) {
    super(props)

    this.state = {
      rewards: []
    }
  }

  _isMounted = false

  rewardUpdated = async () => {
    const rewards = await this.getRewards();
    this.setState({ rewards });
  }

  async componentDidMount() {
    this._isMounted = true
    const rewards = await this.getRewards();

    if (this._isMounted) this.setState({ rewards })
  }

  private async getRewards() {
    const rewards = await getRewardsArray()

    rewards.push({
      name: "Új jutalom hozzáadása...",
      trophy: "Kategória",
      description: "Leírás...",
      id: "dummy_id"
    })
    return rewards
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    return (
      <div>
        <h1>Jutalmak szerkesztése</h1>
        <div className="row">
          {this.state.rewards.length > 0 ? (
            this.state.rewards.map(reward => (
              <EditRewardCard rewardUpdated={this.rewardUpdated} key={reward.id} reward={reward} />
            ))
          ) : (
              <div className="my-5 m-auto">
                <Loading />
              </div>
            )}
        </div>
      </div>
    )
  }
}
