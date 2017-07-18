import React from 'react'
import { connect } from 'react-redux'
import { assocPath, dissocPath, toPairs } from 'ramda'
import { uid } from 'util/uuid'
import { openInputModal } from 'store/actions/modal'
import Button from 'shared/component/general/Button'
import Markdown from 'shared/component/general/Markdown'

const strings = {
  prefix: 'Előtag',
  postfix: 'Utótag'
}

export default connect(undefined, {openInputModal})(class extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      prefix: props.value.prefix || null,
      postfix: props.value.postfix || null,
      solution: props.value.solution || {
        ignoreSpaces: props.value.ignoreSpaces || false,
        caseSensitive: props.value.caseSensitive || true,
        options: false
      }
    }
  }

  componentWillMount () {
    if (!this.state.solution.options) {
      this.addSolution()
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

  addSolution = () => {
    this.updateState(assocPath(['solution', 'options', uid()], 'Megoldás', this.state))
  }

  setSolution = (e) => {
    const {name, value} = e.currentTarget
    this.updateState(assocPath(['solution', 'options', name], value, this.state))
  }

  delSolution = (key) => () => {
    this.updateState(dissocPath(['solution', 'options', key], this.state))
  }

  setOption = (e) => {
    const {name, checked} = e.currentTarget
    this.updateState(assocPath(['solution', name], checked, this.state))
  }

  updateState = (data) => {
    const state = {...this.state, ...data}
    this.setState(state)
    if (this.props.onChange) {
      this.props.onChange({value: state, name: this.props.name})
    }
  }

  render () {
    const {prefix, postfix} = this.state
    const {editLabel, deleteLabel} = this
    const solution = toPairs(this.state.solution.options)

    return (<div className="user-control simple-text simple-text-admin">
      <div className="d-flex align-items-center">
        <Label {...{name: 'prefix', value: prefix, editLabel, deleteLabel}} />
        <input
          type="text"
          readOnly
          className="form-control"
        />
        <Label {...{name: 'postfix', value: postfix, editLabel, deleteLabel}} />
      </div>
      <div>
        <ol>
          {solution.map(item => this.renderItem(item, solution.length < 2))}
        </ol>
        <Button className="btn-sm btn-link" onAction={this.addSolution}>
          <i className="fa fa-plus"/> Alternatív megoldás megadása
        </Button>
      </div>
      <div>
        <label className="custom-control custom-checkbox">
          <input
            type="checkbox"
            className="custom-control-input"
            name="ignoreSpaces"
            checked={this.state.solution.ignoreSpaces}
            onChange={this.setOption}
          />
          <span className="custom-control-indicator"/>
          <span className="custom-control-description">Szóközök figyelmen kívül hagyása</span>
        </label>
        <label className="custom-control custom-checkbox">
          <input
            type="checkbox"
            className="custom-control-input"
            name="caseSensitive"
            checked={this.state.solution.caseSensitive}
            onChange={this.setOption}
          />
          <span className="custom-control-indicator"/>
          <span className="custom-control-description">Kis- és nagybetűk megkülönböztetése</span>
        </label>
      </div>
    </div>)
  }

  renderItem = ([key, text], isLast) => {
    return (
      <li key={key}>
        <div className="d-flex">
          <input
            type="text"
            className="form-control"
            value={text}
            name={key}
            required
            onChange={this.setSolution}/>
          {
            isLast
              ? ''
              : <Button className="btn-sm btn-link" onAction={this.delSolution(key)}>
                <span className="text-danger"><i className="fa fa-trash"/></span>
              </Button>
          }
        </div>
      </li>
    )
  }
})

const Muted = (props) => (<i className="text-muted">{props.children}</i>)

const Label = (props) => (
  <span className="d-flex align-items-center">
    {props.value ? <Markdown source={props.value}/> : <Muted>{strings[props.name]}</Muted>}
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
  </span>
)
