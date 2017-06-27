import {assocPath, assoc, dissoc, pathOr} from 'ramda'
import React from 'react'
import {connect} from 'react-redux'
import {NavLink} from 'react-router-dom'
import Markdown from '../../component/general/Markdown'
import {createExerciseAction, updateExerciseAction} from '../../store/actions/exercise'
import {getPrivateExercise} from '../../store/services/exercise'
import {openAlertModal} from '../../store/actions/modal'
import SingleChoiceAdmin from '../../component/input/SingleChoiceAdmin'

const Muted = (props) => (<span className="text-muted">{props.children}</span>)

export default connect(undefined, {openAlertModal, createExerciseAction, updateExerciseAction})(
  class extends React.Component {
    state = {
      loading: true,
      exercise: {}
    }

    componentWillMount() {
      const key = this.props.match.params.key
      const cloneKey = this.props.match.params.clone
      if (key) {
        return getPrivateExercise(key)
          .then(this.setExercise)
      }
      if (cloneKey) {
        return getPrivateExercise(cloneKey)
          .then(dissoc('_key'))
          .then(ex => assoc('title', (ex.title || '') + ' (copy)'))
          .then(this.setExercise)
      }
      return this.setExercise({})
    }

    setExercise = (exercise) => {
      this.setState({exercise, loading: false})
    }

    saveExercise = (event) => {
      event.preventDefault()
      const ex = this.state.exercise
      if (ex._key) {
        this.props.updateExerciseAction(ex._key, ex).then(this.back)
      } else {
        this.props.createExerciseAction(ex).then(this.back)
      }
    }

    back = () => {
      this.props.history.push('/exercise')
    }

    update = (event) => {
      const {name, value} = event.currentTarget || event
      this.setState(() => ({exercise: assocPath(name.split('.'), value, this.state.exercise)}))
    }

    render() {
      const key = this.props.match.params.key
      const loading = this.state.loading

      return loading
        ? (<Muted>Loading...</Muted>)
        : (<div>
            <div className="d-flex justify-content-between align-items-center">
              <h2>{key ? 'Update' : 'Add'} exercise</h2>
              <NavLink exact to="/exercise">Cancel</NavLink>
            </div>
            <hr/>
            <div className="row">
              <div className="col">{this.renderForm()}</div>
              <div className="col">{this.renderPreview()}</div>
            </div>
          </div>
        )
    }

    renderForm() {
      const ex = this.state.exercise
      return (<form onSubmit={this.saveExercise}>
        <div className="form-group row">
          <label className="col-4 col-form-label">Grade: </label>
          <div className="col-8">
            <input
              className="form-control"
              type="text"
              name="classification.grade"
              onChange={this.update}
              value={pathOr('', ['classification', 'grade'], ex)}
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-4 col-form-label">Subject: </label>
          <div className="col-8">
            <input
              className="form-control"
              type="text"
              name="classification.subject"
              onChange={this.update}
              value={pathOr('', ['classification', 'subject'], ex)}
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-4 col-form-label">Topic: </label>
          <div className="col-8">
            <input
              className="form-control"
              type="text"
              name="classification.topic"
              onChange={this.update}
              value={pathOr('', ['classification', 'topic'], ex)}
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-4 col-form-label">Title: </label>
          <div className="col-8">
            <input
              className="form-control"
              type="text"
              name="title"
              onChange={this.update}
              value={pathOr('', ['title'], ex)}
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-4 col-form-label">Tags:</label>
          <div className="col-8">
            <input
              className="form-control"
              type="text"
              name="classification.tags"
              onChange={this.update}
              value={pathOr('', ['classification', 'tags'], ex)}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="d-flex justify-content-between align-items-center">
            <div>Description:</div>
            <button
              tabIndex="-1"
              type="button"
              className="btn btn-sm btn-link"
              onClick={() => this.props.openAlertModal('Help', 'Help text for markdown...')}
            >
              Help for markdown
            </button>

          </label>
          <textarea
            className="form-control"
            name="description"
            rows="10"
            onChange={this.update}
            value={pathOr('', ['description'], ex)}
          />
        </div>
        <h4>Solution 1</h4>
        <div className="form-group row">
          <label className="col-4 col-form-label">Input type:</label>
          <div className="col-8">
            <select
              name="inputType"
              className="form-control"
              onChange={this.update}
              value={pathOr('', ['inputType'], ex)}
            >
              <option value="single-choice">Single choice</option>
            </select>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-4 col-form-label">Solution: </label>
          <div className="col-8">
            <SingleChoiceAdmin
              name="solution"
              value={pathOr('', ['solution'], ex)}
              onChange={this.update}
            />
          </div>
        </div>
        <div className="col-sm-8 offset-sm-4">
          <button type="submit" className="btn btn-primary">Save</button>
        </div>
      </form>)
    }

    renderPreview() {
      const {classification, description} = this.state.exercise
      return (<div>
        <h4>{classification && classification.subject || <Muted>Subject</Muted>}
          / {classification && classification.topic || <Muted>Topic</Muted>}</h4>
        {
          description
            ? <Markdown source={description}/>
            : <Muted>Description...</Muted>
        }
      </div>)
    }
  })