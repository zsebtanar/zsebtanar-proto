import { pathOr } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { openInputModal } from 'shared/store/actions/modal'
import { MarkdownField } from 'shared/component/userControls/common/MarkdownField'

export const SingleNumberAdmin = connect(undefined, { openInputModal })(
  class extends React.Component {
    constructor(props) {
      super(props)

      this.state = {
        prefix: pathOr(null, ['value', 'prefix'], props),
        postfix: pathOr(null, ['value', 'postfix'], props),
        fractionDigits: pathOr(0, ['value', 'fractionDigits'], props),
        solution: pathOr('', ['value', 'solution'], props)
      }
    }

    editLabel = ({ name, value }) => this.updateState({ [name]: value })

    setSolution = e => {
      const { value } = e.currentTarget
      this.updateState({ solution: value })
    }

    setFractionDigits = e => {
      const { value } = e.currentTarget
      this.updateState({ fractionDigits: parseInt(value, 10) })
    }

    updateState = data => {
      const state = { ...this.state, ...data }
      this.setState(state)
      if (this.props.onChange) {
        this.props.onChange({ value: state, name: this.props.name })
      }
    }

    render() {
      const { prefix, postfix, solution, fractionDigits } = this.state
      return (
        <div className="user-control single-number single-number-admin">
          <MarkdownField
            label="Előtag"
            name="prefix"
            value={prefix}
            placeholder="Üres"
            onChange={this.editLabel}
            resources={this.props.resources}
            cleanable
          />
          <MarkdownField
            label="Utótag"
            name="postfix"
            value={postfix}
            placeholder="Üres"
            onChange={this.editLabel}
            resources={this.props.resources}
            cleanable
          />
          <div className="form-group row">
            <label className="col-3 col-form-label">Maximális tizedes jegyek száma:</label>
            <div className="col-7">
              <input
                type="number"
                onChange={this.setFractionDigits}
                className="form-control"
                value={fractionDigits}
                step={1}
                min={0}
                max={10}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-3 col-form-label">Megoldás:</label>
            <div className="col-7">
              <input
                type="number"
                onChange={this.setSolution}
                className="form-control"
                value={solution}
                step={1 / Math.pow(10, fractionDigits || 0)}
              />
            </div>
          </div>
        </div>
      )
    }
  }
)
