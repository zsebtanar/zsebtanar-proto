import React from 'react'
import {connect} from 'react-redux'
import {openInputModal} from '../../../store/actions/modal'


export default connect(undefined, {openInputModal})(class extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      prefix: props.value.prefix || null,
      postfix: props.value.postfix || null,
      solution: props.value.solution || ''
    }
  }

  editLabel = labelName => () => {
    this.props.openInputModal({
      title: 'Label editor',
      label: labelName,
      value: this.state[labelName],
      onUpdate: (label) => this.updateState({[labelName]: label})
    })
  }

  deleteLabel = labelName => () => {
    this.updateState({[labelName]: undefined})
  }

  setSolution = (e) => {
    const {value} = e.currentTarget
    this.updateState({solution: value})
  }

  updateState = (data) => {
    const state = {...this.state, ...data}
    this.setState(state)
    if (this.props.onChange) {
      this.props.onChange({value: state, name: this.props.name})
    }
  }

  render() {
    const {prefix, postfix, solution} = this.state
    const {editLabel, deleteLabel} = this

    return (<div className="single-number single-number-admin d-flex align-items-center">
      <Label {...{name: 'prefix', value: prefix, editLabel, deleteLabel}} />
      <input type="number" onChange={this.setSolution} className="form-control" value={solution}/>
      <Label {...{name: 'postfix', value: postfix, editLabel, deleteLabel}} />
    </div>)
  }
})

const Muted = (props) => (<i className="text-muted">{props.children}</i>)

const Label = (props) => (
  <span>
    {props.value ? props.value : <Muted>{props.name}</Muted>}
    <button
      type="button"
      className="btn btn-sm btn-secondary"
      onClick={props.editLabel(props.name)}
    >
      <i className="fa fa-edit"/>
    </button>
    {
      props.value
        ? <button
          type="button"
          className="btn btn-sm btn-secondary"
          onClick={props.deleteLabel(props.name)}>
          <i className="fa fa-trash"/>
        </button>
        : ''
    }
  </span>
)