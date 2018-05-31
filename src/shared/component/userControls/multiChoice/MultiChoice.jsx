import { mapObjIndexed } from 'ramda'
import React from 'react'
import { Markdown } from 'shared/component/general/Markdown'
import { pairsInOrder, shuffle } from 'shared/util/fn'
import Checkbox from 'shared/component/input/Checkbox'
import Icon from 'shared/component/general/Icon'

export class MultiChoice extends React.Component {
  constructor(props) {
    super(props)
    const opt = pairsInOrder(props.options)
    this.state = {
      options: this.props.randomOrder ? shuffle(opt) : opt,
      solutions: mapObjIndexed(() => false, props.options)
    }
  }

  onChange = e => {
    const { name, checked } = e.currentTarget
    const solutions = { ...this.state.solutions, [name]: checked }
    this.setState({ ...this.state, solutions })

    if (this.props.onChange) {
      this.props.onChange({
        name: this.props.name,
        value: solutions
      })
    }
  }

  render() {
    return (
      <div className="user-control multi-choice">
        {this.props.readOnly ? this.renderReadOnly() : this.renderNormal()}
      </div>
    )
  }
  renderNormal() {
    const options = this.state.options

    return options.map(([id, item]) => (
      <div key={id} className="">
        <Checkbox
          name={id}
          checked={this.props.value !== undefined ? this.props.value[id] === true : this.state[id]}
          onChange={this.onChange}
        >
          <Markdown source={item.label} resources={this.props.resources} />
        </Checkbox>
      </div>
    ))
  }

  renderReadOnly() {
    const { resources } = this.props
    const { options } = this.state

    return options.map(([id, item]) => (
      <div key={id} className="row">
        <Icon fa={value[id] ? 'check' : 'ban'} className="col-1" />
        <Markdown source={item.label} resources={resources} className="col-11" />
      </div>
    ))
  }
}
