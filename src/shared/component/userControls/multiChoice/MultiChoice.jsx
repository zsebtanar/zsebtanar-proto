import React from 'react'
import Markdown from 'shared/component/general/Markdown'
import { pairsInOrder, shuffle } from 'shared/util/fn'
import Checkbox from 'shared/component/input/Checkbox'

export default (class extends React.Component {
    constructor (props) {
    super(props)
    const opt = pairsInOrder(props.options)
    this.state = {
      options: this.props.randomOrder ? shuffle(opt) : opt
    }
  }

  onChange = (e) => {
    const {name, checked} = e.currentTarget
    const solutions = {...this.state.solutions, [name]: checked}
    this.setState({...this.state, solutions})

    if (this.props.onChange) {
      this.props.onChange({
        name: this.props.name,
        value: solutions
      })
    }
  }

  render () {
    const options = this.state.options

    return (<div className="user-control multi-choice">
      {
        options.map(([id, item]) => (
          <div key={id} className="">
            <Checkbox
              name={id}
              checked={this.state[id]}
              onChange={this.onChange}
            >
              <Markdown source={item.label}/>
            </Checkbox>
          </div>
        ))
      }
    </div>)
  }
})
