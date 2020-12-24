import * as React from 'react'
import { Button } from 'client-common/component/general/Button'
import { addReward } from 'client-common/services/rewards'

export interface EditRewardCardProps {
  reward,
  rewardUpdated
}

export interface EditRewardCardState {
  reward,
  rewardUpdated
}

class EditRewardCard extends React.Component<EditRewardCardProps, EditRewardCardState>
{
  constructor(props) {
    super(props)

    this.state = { 
      reward: props.reward,
      rewardUpdated: props.rewardUpdated
     }
  }

  addOrUpdateReward = async () => {
    await addReward(this.state);
    this.state.rewardUpdated();
  }

  private handleChange = (event: React.ChangeEvent<any>) => {
    const { name, value } = event.currentTarget
    
    const reward = this.state.reward;
    reward[name] = value;
    
    this.setState({
      reward
    } as Pick<EditRewardCardState, keyof EditRewardCardState>)
  }

  render() {
    return (
      <form className="card m-1" style={{ width: 'auto' }}>
        <div className="card-body">
          <h4 className="card-title"><input type="text" name="name" value={this.state.reward.name} onChange={this.handleChange} /></h4>
          <h6 className="card-subtitle mb-2 text-muted"><input name="trophy" type="text" value={this.state.reward.trophy} onChange={this.handleChange}/></h6>
          <p className="card-text"><textarea name="description" value={this.state.reward.description} onChange={this.handleChange}/></p>
          <Button onAction={this.addOrUpdateReward}>{this.state.reward._key ? 'Szerkesztés' : 'Hozzáadás'}</Button>
        </div>
      </form>
    )
  }

}

export default EditRewardCard
