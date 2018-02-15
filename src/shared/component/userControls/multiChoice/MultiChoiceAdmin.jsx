import { __, evolve, merge, dissoc, assocPath, keys } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { openInputModal } from 'shared/store/actions/modal'
import { uid } from 'shared/util/uuid'
import { abcIndex, pairsInOrder } from 'shared/util/fn'
import { TrashButton } from 'shared/component/userControls/common/TrashButton'
import { MarkdownField } from 'shared/component/userControls/common/MarkdownField'
import Button from 'shared/component/general/Button'
import Checkbox from 'shared/component/input/Checkbox'

export const MultiChoiceAdmin = connect(undefined, { openInputModal })(
  class extends React.Component {
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
            options: merge(__, {
              [id]: { label: `Nos?`, order: keys(this.state.options).length }
            }),
            solution: merge(__, { [id]: false })
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
      console.log(value)
      this.updateState(
        evolve(
          {
            solution: merge(__, { [name]: value === 'true' })
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
            <Checkbox
              name="randomOrder"
              checked={this.state.solution.randomOrder}
              onChange={this.setParam}
            >
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
                <div className="custom-control custom-radio">
                  <input
                    type="radio"
                    className="custom-control-input"
                    name={item.id}
                    value={true}
                    checked={this.state.solution[item.id]}
                    required
                    onChange={this.selectSolution}
                  />
                  <label className="custom-control-label">Igaz</label>
                </div>
                <div className="custom-control custom-radio">
                  <input
                    type="radio"
                    className="custom-control-input"
                    name={item.id}
                    value={false}
                    checked={!this.state.solution[item.id]}
                    required
                    onChange={this.selectSolution}
                  />
                  <label className="custom-control-label">Hamis</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
)
