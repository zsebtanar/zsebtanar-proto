import * as React from 'react';
import { Loading } from 'client-common/component/general/Loading';


export class RewardSelector extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }

  onChange = event => {
    const selectedReward = this.props.rewards[event.target.value]
    if (selectedReward) {
      this.props.rewardSelected(selectedReward)
    }
  }

  render() {
    return this.props.rewards.length > 0 ? (
      <div>
        <select className="form-control" defaultValue={'DEFAULT'} onChange={this.onChange}>
          <option value="DEFAULT" disabled>Válassz ki egy jutalmat, ha szeretnél hozzá feladatot rendelni</option>
          {this.props.rewards.map((reward, index) => (
            <option key={index} value={index}>{reward.name}</option>)
          )}
        </select>
      </div>
    ) : (
        <Loading />
      )
  }
}