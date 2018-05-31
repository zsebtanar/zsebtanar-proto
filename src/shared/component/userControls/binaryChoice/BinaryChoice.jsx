import { keys, pathOr } from 'ramda'
import React from 'react'
import { pairsInOrder, shuffle } from 'shared/util/fn'
import RadioInput from 'shared/component/input/RadioInput'

export const DEFAULT_TRUE_LABEL = 'Igaz'
export const DEFAULT_FALSE_LABEL = 'Hamis'

export class BinaryChoice extends React.Component {
  // we need state here because: https://github.com/facebook/react/issues/10078
  constructor(props) {
    super(props)
    const opt = pairsInOrder(props.options)
    this.state = {
      options: this.props.randomOrder ? shuffle(opt) : opt,
      solutions: keys(props.options).reduce((acc, id) => ({ ...acc, [id]: false }), {})
    }
  }

  onChange = e => {
    const { name, value } = e.currentTarget
    const state = { ...this.state, [name]: value }
    this.setState(state)

    if (this.props.onChange) {
      this.props.onChange({
        name: this.props.name,
        value: state
      })
    }
  }

  render() {
    return (
      <div className="user-control single-choice">
        {this.props.readOnly ? this.renderReadOnly() : this.renderNormal()}
      </div>
    )
  }

  renderNormal() {
    const options = this.state.options

    return options.map(([id, item]) => (
      <div key={id} className="d-flex justify-content-between">
        {item.label}
        <div className="d-flex">
          <RadioInput
            label={item.trueLabel || DEFAULT_TRUE_LABEL}
            name={id}
            id={id + '-true'}
            value={'true'}
            checked={
              pathOr(this.state[id] || '', ['props', 'value', id], this).toString() === 'true'
            }
            onChange={this.onChange}
            resources={this.props.resources}
          />
          <RadioInput
            label={item.falseLabel || DEFAULT_FALSE_LABEL}
            name={id}
            id={id + '-false'}
            value={'false'}
            checked={
              pathOr(this.state[id] || '', ['props', 'value', id], this).toString() === 'false'
            }
            onChange={this.onChange}
            resources={this.props.resources}
          />
        </div>
      </div>
    ))
  }

  renderReadOnly() {
    const options = this.state.options
    const value = this.props.value

    return options.map(([id, item]) => (
      <div key={id} className="d-flex justify-content-between">
        {item.label}&nbsp;<strong>
          {id in value
            ? value[id] === 'true'
              ? item.trueLabel || DEFAULT_TRUE_LABEL
              : item.falseLabel || DEFAULT_FALSE_LABEL
            : undefined}
        </strong>
      </div>
    ))
  }
}
