import { find, propEq } from 'ramda'
import React from 'react'
import { Markdown } from 'shared/component/general/Markdown'
import Icon from 'shared/component/general/Icon'
import RadioInput from 'shared/component/input/RadioInput'

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
    return (this.props.options || []).map(x => (
      <RadioInput {...x}
        id={x.value.toString()}
        key={x.value}
        name='random'
        onChange={this.onChange}
        checked={this.state.checked === x.value}
        resources={this.props.resources} />
    )
  )
  }

  renderReadOnly() {
    const data = find(propEq('value', this.props.value), this.props.options)

    return (
      <div className="row">
        <Icon fa="check" className="col-1" />
        <Markdown source={data.label} resources={this.props.resources} className="col-11" />
      </div>
    )
  }
}
