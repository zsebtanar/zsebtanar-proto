import React from 'react'
import Markdown from 'shared/component/general/Markdown'
import { find, propEq } from 'ramda'
import Icon from 'shared/component/general/Icon'

export class SingleChoice extends React.Component {
  // we need state here because: https://github.com/facebook/react/issues/10078
  state = { checked: null }
  onChange = e => {
    const checked = e.currentTarget.value
    this.setState({ checked })

    if (this.props.onChange) {
      this.props.onChange({
        name: this.props.name,
        value: checked
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
    return (this.props.options || []).map(x =>
      RadioInput({
        ...x,
        name: 'random',
        onChange: this.onChange,
        checked: this.state.checked === x.value
      })
    )
  }

  renderReadOnly() {
    const data = find(propEq('value', this.props.value), this.props.options)

    return (
      <div className="row">
        <Icon fa="check" className="col-1" />
        <Markdown source={data.label} className="col-11" />
      </div>
    )
  }
}

const RadioInput = props => (
  <label className="custom-control custom-radio d-block" key={props.value}>
    <input {...props} type="radio" className="custom-control-input" required={props.required} />
    <span className="custom-control-indicator" />
    <span className="custom-control-description">
      <Markdown source={props.label} />
    </span>
  </label>
)
