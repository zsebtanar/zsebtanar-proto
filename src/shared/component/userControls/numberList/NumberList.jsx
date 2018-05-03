import React from 'react'
import { mapObjIndexed } from 'ramda'
import { pairsInOrder } from '../../../util/fn'
import { Markdown } from 'shared/component/general/Markdown'

export class NumberList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fields: pairsInOrder(props.fields),
      solutions: props.values || mapObjIndexed(() => '', props.fields)
    }
  }

  setSolution = e => {
    const { name, value } = e.currentTarget
    const solutions = { ...this.state.solutions, [name]: value }
    this.setState({ ...this.state, solutions })

    if (this.props.onChange) {
      this.props.onChange({
        name: this.props.name,
        value: solutions
      })
    }
  }

  render() {
    const { prefix, postfix, resources } = this.props
    return (
      <div className="user-control number-list">
        <span className="prefix">
          <Markdown source={prefix} resources={resources} className="d-inline-block" />
        </span>
        {this.readOnly ? this.renderReadOnly() : this.renderNormal()}
        <span className="postfix">
          <Markdown source={postfix} resources={resources} className="d-inline-block" />
        </span>
      </div>
    )
  }

  renderNormal() {
    const { fields, solutions } = this.state
    const { separator, resources, fractionDigits } = this.props
    const lastIdx = fields.length - 1

    return fields.map(([id, item], idx) => (
      <span key={id} >
        <input
          name={id}
          type="number"
          className="form-control col-2 mx-1 d-inline-block"
          onChange={this.setSolution}
          value={solutions[id]}
          step={1 / Math.pow(10, fractionDigits || 0)}
        />
        {idx < lastIdx && <Markdown source={separator} resources={resources} className="d-inline-block" />}
      </span>
    ))
  }

  renderReadOnly() {
    const { fields, solutions } = this.state
    const { separator, resources } = this.props
    const lastIdx = fields.length - 1

    return fields.map(([id, item], idx) => (
      <span key={id}>
        &nbsp;
        <span className="value">{solutions[key]}</span>
        &nbsp;
        {idx < lastIdx && <Markdown source={separator} resources={resources} className="d-inline-block"/>}
      </span>
    ))
  }
}
