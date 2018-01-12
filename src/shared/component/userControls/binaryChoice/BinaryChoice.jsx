import { keys } from 'ramda'
import React from 'react'
import Markdown from 'shared/component/general/Markdown'
import { pairsInOrder, shuffle } from 'shared/util/fn'

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
            value={'true'}
            checked={this.state[id] === 'true'}
            onChange={this.onChange}
          />
          <RadioInput
            label={item.falseLabel || DEFAULT_FALSE_LABEL}
            name={id}
            value={'false'}
            checked={this.state[id] === 'false'}
            onChange={this.onChange}
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
          {value[id] === 'true' ? (
            item.trueLabel || DEFAULT_TRUE_LABEL
          ) : (
            item.falseLabel || DEFAULT_FALSE_LABEL
          )}
        </strong>
      </div>
    ))
  }
}

const RadioInput = props => (
  <label className="custom-control custom-radio d-block">
    <input {...props} type="radio" className="custom-control-input" />
    <span className="custom-control-indicator" />
    <span className="custom-control-description">
      <Markdown source={props.label} />
    </span>
  </label>
)
