import { find, propEq } from 'ramda'
import React from 'react'
import { Markdown } from 'shared/component/general/Markdown'
import Icon from 'shared/component/general/Icon'
import RadioInput from 'shared/component/input/RadioInput'
import { uid } from 'shared/util/uuid'

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
    const key = uid()
    return (
      <div className="user-control single-choice" id={key}>
        {this.props.readOnly ? this.renderReadOnly() : this.renderNormal(key)}
      </div>
    )
  }

  renderNormal(key) {
    const { options, value, resources } = this.props
    return (options || []).map(item => (
      <RadioInput
        {...item}
        key={key + '-' + item.value}
        id={key + '-' + item.value}
        name={key + '-name'}
        onChange={this.onChange}
        checked={(value !== undefined ? value : this.state.checked) === item.value}
        resources={resources}
      />
    ))
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
