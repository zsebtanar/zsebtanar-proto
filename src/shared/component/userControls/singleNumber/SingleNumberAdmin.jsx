import React from 'react'
import { connect } from 'react-redux'
import { openInputModal } from 'shared/store/actions/modal'
import MarkdownField from 'shared/component/userControls/common/MarkdownField'

export default connect(undefined, { openInputModal })(
  class extends React.Component {
    constructor(props) {
      super(props)

      this.state = {
        prefix: props.value.prefix || null,
        postfix: props.value.postfix || null,
        solution: props.value.solution || ''
      }
    }

    editLabel = ({ name, value }) => this.updateState({ [name]: value })

    setSolution = e => {
      const { value } = e.currentTarget
      this.updateState({ solution: value })
    }

    updateState = data => {
      const state = { ...this.state, ...data }
      this.setState(state)
      if (this.props.onChange) {
        this.props.onChange({ value: state, name: this.props.name })
      }
    }

    render() {
      const { prefix, postfix, solution } = this.state
      return (
        <div className="user-control single-number single-number-admin">
          <MarkdownField
            label="Előtag"
            name="prefix"
            value={prefix}
            placeholder="Üres"
            onChange={this.editLabel}
            cleanable
          />
          <MarkdownField
            label="Utótag"
            name="postfix"
            value={postfix}
            placeholder="Üres"
            onChange={this.editLabel}
            cleanable
          />
          <div className="form-group row">
            <label className="col-3 col-form-label">Megoldás:</label>
            <div className="col-7">
              <input type="number" onChange={this.setSolution} className="form-control" value={solution} />
            </div>
          </div>
        </div>
      )
    }
  }
)
