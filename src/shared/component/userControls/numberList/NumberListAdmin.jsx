import { assocPath, dissocPath, evolve, keys, pathOr } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { openInputModal } from 'shared/store/actions/modal'
import { MarkdownField } from 'shared/component/userControls/common/MarkdownField'
import Checkbox from '../../input/Checkbox'
import Button from '../../general/Button'
import { TrashButton } from '../common/TrashButton'
import { uid } from '../../../util/uuid'
import { orderedListFromObj, removeFromObjById } from '../../../util/OrderedMap'

export const NumberListAdmin = connect(undefined, { openInputModal })(
  class extends React.Component {
    constructor(props) {
      super(props)

      this.state = {
        prefix: pathOr(null, ['value', 'prefix'], props),
        postfix: pathOr(null, ['value', 'postfix'], props),
        separator: pathOr(', ', ['value', 'separator'], props),
        fields: pathOr({}, ['value', 'fields'], props),
        fractionDigits: pathOr(0, ['value', 'fractionDigits'], props),
        acceptRandomOrder: pathOr(false, ['value', 'randomOrderAccepted'], props),
        solution: pathOr({ options: false }, ['value', 'solution'], props)
      }
    }

    componentWillMount() {
      if (!this.state.solution.options) {
        this.addSolution()
      }
    }

    editLabel = ({ name, value }) => this.updateState(assocPath([name], value))

    setFractionDigits = e => {
      const { value } = e.currentTarget
      this.updateState(assocPath(['fractionDigits'], parseInt(value, 10)))
    }

    addSolution = () => {
      const id = uid()
      this.updateState(
        evolve({
          fields: assocPath([id], { order: keys(this.state.fields).length }),
          solution: assocPath(['options', id], 0)
        })
      )
    }

    delSolution = key => () => {
      this.updateState(
        evolve({
          fields: removeFromObjById(key),
          solution: dissocPath(['options', key])
        })
      )
    }

    setSolution = e => {
      const { name, value } = e.currentTarget
      this.updateState(assocPath(['solution', 'options', name], value))
    }

    setCheckbox = e => {
      const { name, checked } = e.currentTarget
      this.updateState(assocPath([name], checked))
    }

    updateState = fn => {
      const state = fn(this.state)
      this.setState(state)
      if (this.props.onChange) {
        this.props.onChange({ value: state, name: this.props.name })
      }
    }

    render() {
      const { acceptRandomOrder, prefix, separator, fields, postfix, solution, fractionDigits } = this.state
      const orderdFields = orderedListFromObj(fields)
      return (
        <div className="user-control number-list number-list-admin">
          <div>
            <Checkbox
              name="acceptRandomOrder"
              checked={acceptRandomOrder}
              onChange={this.setCheckbox}
            >
              Megoldások elfogadása tetszőleges sorrendben
            </Checkbox>
          </div>
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
            label="Elválasztó"
            name="separator"
            value={separator}
            placeholder=", "
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
            <label className="col-3 col-form-label">Megoldás mezők:</label>
            <div className="col-9">
              <ol className="list-unstyled">
                {orderdFields.map((item) => this.renderItem(item, solution.length < 2))}
              </ol>
            </div>
          </div>
          <div className="form-group row">
            <div className="col-9 ml-auto">
              <Button
                icon="plus"
                className="btn-sm btn-outline-primary d-block mx-auto"
                onAction={this.addSolution}
              >
                Új mező felvétele
              </Button>
            </div>
          </div>
        </div>
      )
    }

    renderItem = ([key], isLast) => {
      const {fractionDigits, solution} = this.state
      return (
        <li key={key}>
          <div className="d-flex">
            <input
              key={key}
              type="number"
              name={key}
              onChange={this.setSolution}
              className="form-control mt-1"
              value={solution.options[key]}
              required
              step={1 / Math.pow(10, fractionDigits || 0)}
            />
            {isLast ? '' : <TrashButton onAction={this.delSolution(key)} />}
          </div>
        </li>
      )
    }
  }
)
