import * as React from 'react'
import { pathOr } from 'ramda'
import { connect } from 'react-redux'
import { openInputModal } from 'client-common/store/actions/modal'
import { MarkdownField } from '../common/MarkdownField'

export const SingleNumberAdmin = connect(
  undefined,
  { openInputModal }
)(
  class SingleNumberAdminComp extends React.Component<any, any> {
    constructor(props) {
      super(props)

      this.state = {
        name: pathOr('', ['value', 'name'], props),
        isDynamic: pathOr(false, ['value', 'isDynamic'], props),
        prefix: pathOr(null, ['value', 'prefix'], props),
        postfix: pathOr(null, ['value', 'postfix'], props),
        fractionDigits: pathOr(0, ['value', 'fractionDigits'], props),
        solution: pathOr('', ['value', 'solution'], props)
      }
    }

    setName = e => {
      const { value } = e.currentTarget
      this.updateState({ name: value })
    }

    setIsDynamic = e => {
      const { checked } = e.currentTarget
      this.updateState({ isDynamic: checked })
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
      const { name, isDynamic, prefix, postfix, solution, fractionDigits } = this.state
      return (
        <div className="user-control single-number single-number-admin">
          <div className="form-group row">
            <label className="col-3 col-form-label" htmlFor="simple-number-name">
              Mező neve
            </label>
            <div className="col-9">
              <input
                id="simple-number-name"
                aria-describedby="simple-number-name-desc"
                type="text"
                onChange={this.setName}
                className="form-control form-control-sm"
                value={name}
                required={true}
                pattern="^[a-zA-Z_][\w-]*$"
              />
              <small id="simple-number-name-desc" className="text-muted">
                <ul>
                  <li>Egyedi kell legyen a feladaton belül</li>
                  <li>Csak betűvel kezdődthet </li>
                  <li>Nem tartalmazhat szóköz vagy ékezetes karakter</li>
                </ul>
              </small>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-3 col-form-label" htmlFor="is-dynamic-field">
              Dinamikus:
            </label>
            <div className="col-9">
              <input
                id="is-dynamic-field"
                type="checkbox"
                onChange={this.setIsDynamic}
                value={isDynamic}
                className="w-auto"
              />
            </div>
          </div>
          <hr />
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
          <hr />
          <div className="form-group row">
            <label className="col-3 col-form-label" htmlFor="max-fraction-digits">
              Pontosság:
            </label>
            <div className="col-9">
              <input
                id="max-fraction-digits"
                aria-describedby="max-fraction-digits-desc"
                type="number"
                onChange={this.setFractionDigits}
                className="form-control form-control-sm"
                value={fractionDigits}
                step={1}
                min={0}
                max={10}
              />
              <small id="max-fraction-digits-desc" className="text-muted">
                Maximális tizedes jegyek száma
              </small>
            </div>
          </div>

          <div className="form-group row">
            <label className="col-3 col-form-label" htmlFor="solution-field">
              Megoldás:
            </label>
            {isDynamic ? (
              <div className="text-muted">Generált megoldás</div>
            ) : (
              <div className="col-9">
                <input
                  id="solution-field"
                  aria-describedby="solution-field-desc"
                  type="number"
                  onChange={this.setSolution}
                  className="form-control form-control-sm"
                  value={solution}
                  step={1 / Math.pow(10, fractionDigits || 0)}
                />
              </div>
            )}
          </div>
        </div>
      )
    }
  }
)
