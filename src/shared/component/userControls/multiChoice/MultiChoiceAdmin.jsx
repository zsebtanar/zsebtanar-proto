import React from 'react'
import { connect } from 'react-redux'
import { __, evolve, merge, dissoc, assocPath, keys } from 'ramda'
import { openInputModal } from 'shared/store/actions/modal'
import Button from 'shared/component/general/Button'
import { uid } from 'shared/util/uuid'
import { pairsInOrder } from 'shared/util/fn'
import Checkbox from 'shared/component/input/Checkbox'
import TrashButton from 'shared/component/userControls/common/TrashButton'
import MarkdownField from 'shared/component/userControls/common/MarkdownField'

export default connect(undefined, {openInputModal})(class extends React.Component {
  state = {
    options: {},
    randomOrder: false,
    solution: {}
  }

  componentWillMount () {
    if (this.props.value && this.props.value.options) {
      this.setState(this.props.value)
    } else if (keys(this.state.options).length < 1) {
      this.addItem()
    }
  }

  addItem = () => {
    const id = uid()
    this.updateState(evolve({
      options: merge(__, {[id]: {label: `Állítás`, order: keys(this.state.options).length}}),
      solution: merge(__, {[id]: false})
    }, this.state))
  }

  removeItem = (id) => {
    this.updateState(evolve({
      options: dissoc(id),
      solution: dissoc(id)
    }, this.state))
  }

  selectSolution = (e) => {
    const {name, checked} = e.currentTarget
    this.updateState(evolve({
      solution: merge(__, {[name]: checked})
    }, this.state))
  }

  setParam = (e) => {
    const {name, checked} = e.currentTarget
    this.updateState(assocPath([name], checked, this.state))
  }

  updateOption = (id) => ({name, value}) => {
    this.updateState(assocPath(['options', id, name], value, this.state))
  }

  updateState = (value) => {
    this.setState(value)
    const {onChange, name} = this.props

    if (onChange) onChange({name, value})
  }

  render () {
    const options = pairsInOrder(this.state.options)

    return (<div className="user-control binary-choice binary-choice-admin">
      <div>
        <ol>
          {options.map(([id, data]) => this.renderItem({id, ...data, name: 'admin', isLast: options.length < 2}))}
        </ol>
        <Button className="btn-sm btn-link" onAction={this.addItem}>
          <i className="fa fa-plus"/> Válasz lehetőség hozzáadása
        </Button>
      </div>
      <div>
        <Checkbox
          name="randomOrder"
          checked={this.state.solution.randomOrder}
          onChange={this.setParam}
        >
          Kitöltéskor az állítások véletlenszerű sorredben jelenjenek meg
        </Checkbox>
      </div>
    </div>)
  }

  renderItem = (item) => {
    return (
      <li key={item.id}>
        <MarkdownField
          label="Állítás"
          name="label"
          value={item.label}
          onChange={this.updateOption(item.id)}
        />
        <Checkbox
          name={item.id}
          checked={this.state.solution[item.id]}
          onChange={this.selectSolution}
        >
          Megoldás értéke
        </Checkbox>
        {
          item.isLast ? '' : <TrashButton onAction={() => this.removeItem(item.id)}/>
        }
      </li>
    )
  }
})
