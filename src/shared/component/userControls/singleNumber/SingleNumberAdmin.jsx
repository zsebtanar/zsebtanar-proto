import React from 'react'
import { connect } from 'react-redux'
import { openInputModal } from 'store/actions/modal'
import Button from 'shared/component/general/Button'
import Markdown from 'shared/component/general/Markdown'

const strings = {
  prefix: 'Előtag',
  postfix: 'Utótag',
}

export default connect(undefined, {openInputModal})(class extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      prefix: props.value.prefix || null,
      postfix: props.value.postfix || null,
      solution: props.value.solution || ''
    }
  }

  editLabel = labelName => () => {
    this.props.openInputModal({
      title: 'Felirat szerkesztő',
      label: strings[labelName],
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

  render () {
    const {prefix, postfix, solution} = this.state
    const {editLabel, deleteLabel} = this

    return (<div className="user-control single-number single-number-admin">
      <Label {...{name: 'prefix', value: prefix, editLabel, deleteLabel}} />
      <Label {...{name: 'postfix', value: postfix, editLabel, deleteLabel}} />
      <div className="form-group row">
        <label className="col-3 col-form-label">Megoldás:</label>
        <div className="col-7">
          <input
            type="number"
            onChange={this.setSolution}
            className="form-control"
            value={solution}
          />
        </div>
      </div>
    </div>)
  }
})

const Muted = (props) => (<i className="text-muted">{props.children}</i>)


const Label = (props) => (
  <div className="form-group row">
    <label className="col-3 col-form-label">{strings[props.name]}:</label>
    <div className="col-6">
      <p className="form-control-static">
        {props.value ? <Markdown source={props.value}/> : <Muted>Üres</Muted>}
      </p>
    </div>
    <div className="col-3 text-right">
      <Button onAction={props.editLabel(props.name)} className="btn-sm btn-link">
        <i className="fa fa-edit"/>
      </Button>
      {
        props.value
          ? <Button onAction={props.deleteLabel(props.name)} className="btn-sm btn-link text-danger">
            <i className="fa fa-trash"/>
          </Button>
          : ''
      }
    </div>
  </div>
)
