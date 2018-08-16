import * as React from 'react'
import { Markdown } from 'client-common/component/general/Markdown'
import { assoc } from 'ramda'

interface FractionNumberProps {
  name: string
  value: FractionNumber
  readOnly?: boolean
  prefix?: string
  postfix?: string
  resources?: MarkdownResources
  onChange?: (event: {name: string, value: any}) => void
}

const onlyNumbers = event => {
  if (!/[-0-9]/.test(event.key)) event.preventDefault()
}

export class FractionNumberComponent extends React.Component<FractionNumberProps, {}> {
  private setSolution = (event) => {
    if (this.props.onChange) {
      const { name, value } = event.currentTarget
      this.props.onChange({
        name: this.props.name,
        value: assoc(name, value, this.props.value)
      })
    }
  }

  render() {
    return (
      <div className="user-control fraction-number d-flex align-items-center">
      <span className="prefix">
        <Markdown source={this.props.prefix} resources={this.props.resources}/>
      </span>
        {this.props.readOnly ? (
          <div className="mx-2 text-center">
            <strong>&nbsp;{this.props.value && this.props.value.numerator}&nbsp;</strong>
            <hr className="my-1"/>
            <strong>&nbsp;{this.props.value && this.props.value.denominator}&nbsp;</strong>
          </div>
        ) : (
          <div className="input-row">
            <input
              name="numerator"
              type="number"
              inputMode="decimal"
              className="form-control"
              value={this.props.value && this.props.value.numerator}
              onChange={this.setSolution}
              step="1"
              onKeyPress={onlyNumbers}
              placeholder="számláló"
            />
            <hr className="my-1"/>
            <input
              name="denominator"
              type="number"
              inputMode="decimal"
              className="form-control"
              value={this.props.value && this.props.value.denominator}
              onChange={this.setSolution}
              onKeyPress={onlyNumbers}
              step="1"
              placeholder="nevező"
            />
          </div>
        )}
        <span className="postfix">
        <Markdown source={this.props.postfix} resources={this.props.resources}/>
      </span>
      </div>
    )
  }
}
