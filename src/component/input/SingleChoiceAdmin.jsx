import React from 'react'
import {connect} from 'react-redux'
import {map, findIndex, pick, propEq, update} from 'ramda'
import {openInputModal} from '../../store/actions/modal'


export default connect(undefined, {openInputModal})(class extends React.Component {
  state = {
    items: [],
    solution: undefined
  }

  componentWillMount() {
    if (this.props.value && this.props.value.items){
      this.setState(this.props.value)
    } else if (this.state.items.length < 1) {
      this.addItem()
    }
  }

  addItem = () => {
    const items = [...this.state.items, {label: `Option`}]
    this.updateState({items})
  }

  removeItem = (value) => {
    this.updateState({items: this.state.items.filter(x => x.value !== value)})
  }

  editItem = (item) => {
    const idx = findIndex(propEq('value', item.value), this.state.items)
    const onUpdate = (label) => {
      const items = update(idx, {...item, label}, this.state.items)
      this.updateState({items})
    }
    this.props.openInputModal({title: 'Options label editor', label: 'Options label', value: item.label, onUpdate})
  }

  selectSolution = (e) => {
    const {value} = e.currentTarget
    this.updateState({solution: value})
  }

  updateState = (data) => {
    if (data.items){
      data.items = data.items.map((item, idx) =>  ({...item, value: idx.toString()}))
    }
    const state = {...this.state, ...data}
    this.setState(state)
    if (this.props.onChange){
      this.props.onChange({value: {
        items: map(pick(['label', 'value']), state.items),
        solution: state.solution
      }, name: this.props.name})
    }
  }

  render() {
    const items = this.state.items;
    return (<div className="single-choice single-choice-admin">
      <button
        type="button"
        className="btn btn-sm btn-secondary"
        onClick={this.addItem}
      >
        <i className="fa fa-plus"/> Add option
      </button>
      <ol>
        {items.map((data) => this.renderItem({...data, name: 'admin', isLast: items.length < 2}))}
      </ol>
    </div>)
  }

  renderItem = (item) => {
    return (
      <li key={`${item.value}-${item.label}`}>
        <label className="custom-control custom-radio">
          <input
            type="radio"
            className="custom-control-input"
            name={item.name}
            value={item.value}
            checked={item.value === this.state.solution}
            onChange={this.selectSolution}/>
          <span className="custom-control-indicator"/>
          <span className="custom-control-description">{item.label}</span>
        </label>
        {
          item.isLast
            ? ''
            : <button
              className="btn btn-sm btn-link"
              type="button"
              onClick={() => this.removeItem(item.value)}
            >
              <span className="text-danger"><i className="fa fa-trash"/></span>
            </button>
        }
        <button
          className="btn btn-sm btn-link"
          type="button"
          onClick={() => this.editItem(item)}
        >
          <i className="fa fa-edit"/>
        </button>
      </li>
    )
  }
})
