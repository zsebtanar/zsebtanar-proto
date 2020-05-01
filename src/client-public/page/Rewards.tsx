import * as React from 'react'
import RewardCard from '../component/RewardCard'
import { Loading } from 'client-common/component/general/Loading'

import { getRewardsArray } from 'client-common/services/rewards'
import { connect } from 'react-redux'

export interface RewardsProps {
  userRewards?
}

export interface RewardsState {
  rewards?
}

function mapStateToProps(state) {
  return  {
    userRewards: state && state.app && state.app.session
      && state.app.session.userDetails && state.app.session.userDetails.rewards
  }
}

export const Rewards = connect(
  mapStateToProps
)(
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
            {this.state.rewards.length > 0 ? (
              this.state.rewards.map(e => (
                <RewardCard
                  key={e.id}
                  id={e.id}
                  name={e.name}
                  description={e.description}
                  userOwns={this.props.userRewards && Object.keys(this.props.userRewards).includes(e.id)}
                />
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
  })

export default Rewards
