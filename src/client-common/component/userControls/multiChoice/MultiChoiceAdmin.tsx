import * as React from 'react'
import { assocPath, dissoc, evolve, keys, pathOr } from 'ramda'
import { connect } from 'react-redux'
import { openInputModal } from 'client-common/store/actions/modal'
import { uid } from 'client-common/util/uuid'
import { abcIndex, fMerge, pairsInOrder } from 'shared/util/fn'
import { TrashButton } from 'client-common/component/userControls/common/TrashButton'
import { MarkdownField } from 'client-common/component/userControls/common/MarkdownField'
import { Button } from 'client-common/component/general/Button'
import { Checkbox } from 'client-common/component/input/Checkbox'

export const MultiChoiceAdmin = connect(
  undefined,
  { openInputModal }
)(
  class extends React.Component<any, any> {
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
              [id]: { label: `Nos?`, order: keys(this.state.options).length }
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
            solution: fMerge({ [name]: value === 'true' })
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
            {options.map(([id, data], idx) =>
              this.renderItem({ id, ...data, name: 'admin', isLast: options.length < 2 }, idx)
            )}
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
            <span>{abcIndex(idx)})</span>
            {!item.isLast && (
              <TrashButton label="Törlés" onAction={() => this.removeItem(item.id)} />
            )}
          </div>
          <div className="card-body">
            <MarkdownField
              label="Állítás:"
              name="label"
              value={item.label}
              resources={this.props.resources}
              onChange={this.updateOption(item.id)}
            />
            <div className="row">
              <label className="col-3">Megoldás:</label>
              <div className="col-9">
                <select
                  name={item.id}
                  className="form-control"
                  required
                  defaultValue={pathOr(false, ['solution', 'options', item.id], this.state)}
                  onChange={this.selectSolution}
                >
                  <option value="false">Hamis</option>
                  <option value="true">Igaz</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
)
