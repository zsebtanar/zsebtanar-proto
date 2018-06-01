import * as React from 'react'
import { assocPath, dissoc, evolve, keys, pathOr } from 'ramda'
import { fMerge, pairsInOrder } from 'shared/util/fn'
import { uid } from 'client-common/util/uuid'
import { connect } from 'react-redux'
import { openInputModal } from 'client-common/store/actions/modal'
import { Button } from 'client-common/component/general/Button'
import { Checkbox } from 'client-common/component/input/Checkbox'
import { MarkdownField } from '../common/MarkdownField'
import { TrashButton } from '../common/TrashButton'
import { DEFAULT_FALSE_LABEL, DEFAULT_TRUE_LABEL } from './BinaryChoice'

interface BinaryChoiceAdminState {
  options: any
  solution: any
  randomOrder: boolean
}

export const BinaryChoiceAdmin = connect(
  undefined,
  { openInputModal }
)(
  class extends React.Component<any, BinaryChoiceAdminState> {
    state = {
      options: {},
      randomOrder: false,
      solution: {}
    }

    componentWillMount() {
      if (this.props.value && this.props.value.options) {
        this.setState(this.props.value)
      } else if (keys(this.state.options).length < 1) {
        this.addItem()
      }
    }

    addItem = () => {
      const id = uid()
      this.updateState(
        evolve(
          {
            options: fMerge({
              [id]: { label: `Állítás`, order: keys(this.state.options).length }
            }),
            solution: fMerge({ [id]: false })
          },
          this.state
        )
      )
    }

    removeItem = id => {
      this.updateState(
        evolve(
          {
            options: dissoc(id),
            solution: dissoc(id)
          },
          this.state
        )
      )
    }

    selectSolution = e => {
      const { name, value } = e.currentTarget
      this.updateState(
        evolve(
          {
            solution: fMerge({ [name]: value.toString() === 'true' })
          },
          this.state
        )
      )
    }

    setParam = e => {
      const { name, checked } = e.currentTarget
      this.updateState(assocPath([name], checked, this.state))
    }

    updateOption = id => ({ name, value }) => {
      this.updateState(assocPath(['options', id, name], value, this.state))
    }

    updateState = value => {
      this.setState(value)
      const { onChange, name } = this.props

      if (onChange) onChange({ name, value })
    }

    render() {
      const options = pairsInOrder(this.state.options)
      return (
        <div className="user-control binary-choice binary-choice-admin">
          <div className="my-2">
            <Checkbox name="randomOrder" checked={this.state.randomOrder} onChange={this.setParam}>
              Kitöltéskor az állítások véletlenszerű sorredben jelenjenek meg
            </Checkbox>
          </div>
          <div>
            <div className="list-group">
              {options.map(([id, data], idx) =>
                this.renderItem({ id, ...data, name: 'admin', isLast: options.length < 2 }, idx)
              )}
            </div>
            <Button
              className="btn-sm btn-outline-primary mx-auto my-4 d-block"
              onAction={this.addItem}
            >
              <i className="fa fa-plus" /> Válasz lehetőség hozzáadása
            </Button>
          </div>
        </div>
      )
    }

    renderItem = (item, idx) => {
      return (
        <div key={item.id} className="card mb-1">
          <div className="card-header card-header-sm d-flex justify-content-between align-items-center">
            <span>
              {idx + 1}
              {' - '}
              {item.label}
            </span>
            {item.isLast ? (
              ''
            ) : (
              <TrashButton label="Törlés" onAction={() => this.removeItem(item.id)} />
            )}
          </div>
          <div className="card-body">
            <MarkdownField
              label="Állítás"
              name="label"
              resources={this.props.resources}
              value={item.label}
              onChange={this.updateOption(item.id)}
            />
            <MarkdownField
              label="Igaz"
              name="trueLabel"
              resources={this.props.resources}
              value={item.trueLabel}
              placeholder={DEFAULT_TRUE_LABEL}
              onChange={this.updateOption(item.id)}
              cleanable
            />
            <MarkdownField
              label="Hamis"
              name="falseLabel"
              resources={this.props.resources}
              value={item.falseLabel}
              placeholder={DEFAULT_FALSE_LABEL}
              onChange={this.updateOption(item.id)}
              cleanable
            />

            <div className="form-group row">
              <label className="col-3 col-form-label">Megoldás</label>
              <div className="col-6">
                <select
                  name={item.id}
                  className="form-control"
                  required
                  defaultValue={pathOr(false, ['solution', item.id], this.state).toString()}
                  onChange={this.selectSolution}
                >
                  <option value="false">{item.falseLabel || DEFAULT_FALSE_LABEL}</option>
                  <option value="true">{item.trueLabel || DEFAULT_TRUE_LABEL}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
)
