import React from 'react'
import { connect } from 'react-redux'
import { findIndex, map, pick, propEq, update } from 'ramda'
import { openInputModal } from 'shared/store/actions/modal'
import Button from 'shared/component/general/Button'
import Markdown from 'shared/component/general/Markdown'

export default connect(undefined, { openInputModal })(
  class extends React.Component {
    state = {
      options: [],
      solution: undefined
    }

    componentWillMount() {
      if (this.props.value && this.props.value.options) {
        this.setState(this.props.value)
      } else if (this.state.options.length < 1) {
        this.addItem()
      }
    }

    addItem = () => {
      const options = [...this.state.options, { label: `Option` }]
      this.updateState({ options })
    }

    removeItem = value => {
      this.updateState({ options: this.state.options.filter(x => x.value !== value) })
    }

    editItem = item => {
      const idx = findIndex(propEq('value', item.value), this.state.options)
      const onUpdate = label => {
        const options = update(idx, { ...item, label }, this.state.options)
        this.updateState({ options })
      }
      this.props.openInputModal({
        title: 'Válasz szövegének szerkesztése',
        label: 'Válasz szövege',
        value: item.label,
        onUpdate
      })
    }

    selectSolution = e => {
      const { value } = e.currentTarget
      this.updateState({ solution: value })
    }

    updateState = data => {
      if (data.options) {
        data.options = data.options.map((item, idx) => ({ ...item, value: idx.toString() }))
      }
      const state = { ...this.state, ...data }
      this.setState(state)
      if (this.props.onChange) {
        this.props.onChange({
          value: {
            options: map(pick(['label', 'value']), state.options),
            solution: state.solution
          },
          name: this.props.name
        })
      }
    }

    render() {
      const options = this.state.options
      return (
        <div className="user-control single-choice single-choice-admin">
          <ol>
            {options.map(data =>
              this.renderItem({ ...data, name: 'admin', isLast: options.length < 2 })
            )}
          </ol>
          <Button className="btn-sm btn-link" onAction={this.addItem}>
            <i className="fa fa-plus" /> Válasz lehetőség hozzáadása
          </Button>
        </div>
      )
    }

    renderItem = item => {
      return (
        <li key={`${item.value}-${item.label}`}>
          <label className="custom-control custom-radio">
            <input
              type="radio"
              className="custom-control-input"
              name={item.name}
              value={item.value}
              checked={item.value === this.state.solution}
              required={this.props.required}
              onChange={this.selectSolution}
            />
            <span className="custom-control-indicator" />
            <span className="custom-control-description">
              <Markdown source={item.label} />
            </span>
          </label>
          {item.isLast ? (
            ''
          ) : (
            <Button className="btn-sm btn-link" onAction={() => this.removeItem(item.value)}>
              <span className="text-danger">
                <i className="fa fa-trash" />
              </span>
            </Button>
          )}
          <Button className="btn-sm btn-link" onAction={() => this.editItem(item)}>
            <i className="fa fa-edit" />
          </Button>
        </li>
      )
    }
  }
)
