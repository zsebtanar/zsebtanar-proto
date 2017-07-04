import {__, merge, assocPath, assoc, dissoc, pathOr, omit, values, evolve, identity} from 'ramda'
import React from 'react'
import {connect} from 'react-redux'
import {NavLink} from 'react-router-dom'
import Markdown from '../../component/general/Markdown'
import {createExerciseAction, updateExerciseAction} from '../../store/actions/exercise'
import {getPrivateExercise} from '../../store/services/exercise'
import {openMarkdownHelpModal} from '../../store/actions/modal'
import UserControls from '../../component/userControls/UserControl'
import UserControlAdmin from '../../component/userControls/UserControlAdmin'
import {SINGLE_CHOICE, SINGLE_NUMBER} from '../../component/userControls/controlTypes'
import {uid} from '../../util/uuid'
import {pairsInOrder} from '../../util/fn'

const Muted = (props) => (<span className="text-muted">{props.children}</span>)

export default connect(undefined, {openMarkdownHelpModal, createExerciseAction, updateExerciseAction})(
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
      return this.setExercise({controls: {}, solutions: {}})
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
      this.setState({exercise: assocPath(name.split('.'), value, this.state.exercise)})
    }

    updateUserControlType = (event) => {
      const {name, value} = event.currentTarget || event
      this.setState(evolve({
        exercise: {
          controls: {
            [name]: merge(__, {
              controlType: value,
              controlProps: {}
            })
          },
          solutions: {[name]: identity(null)}
        }
      }))
    }

    updateSolution = ({name, value}) => {
      console.log(name, value)
      this.setState(evolve({
        exercise: {
          controls: {
            [name]: merge(__, { controlProps: omit(['solution'], value) })
          },
          solutions: merge(__, {[name]: value.solution})
        }
      }))
    }

    addUserControl = () => {
      this.setState(evolve({
        exercise: {
          controls: (c) => ({...c, [uid()]: {order: values(c).length}})
        }
      }))
    }

    removeUserControl = (key) => () => {
      this.setState(evolve({
        exercise: {
          controls: dissoc(key),
          solutions: dissoc(key)
        }
      }))
    }

    render() {
      const key = this.props.match.params.key
      const loading = this.state.loading

      return loading
        ? (<Muted>Loading...</Muted>)
        : (<div>
            <div className="d-flex justify-content-between align-items-center">
              <h2>{key ? 'Update' : 'Add'} exercise</h2>
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
      const controls = pairsInOrder(ex.controls)
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
              onClick={this.props.openMarkdownHelpModal}
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

        <div className="d-flex justify-content-between align-items-center">
          <h4>User controls</h4>
          <button
            type="button"
            className="btn btn-primary"
            title="Add user control"
            onClick={this.addUserControl}
          >
            <i className="fa fa-plus"/>
          </button>
        </div>
        <ol>
          {
            controls.length
              ? controls.map(this.renderUserControlItem)
              : <div className="alert alert-info">Please add at least one user control</div>
          }
        </ol>

        <div className="col-sm-8 offset-sm-4">
          <NavLink exact to="/exercise" className="btn btn-secondary">Cancel</NavLink>
          &nbsp;
          <button type="submit" className="btn btn-primary">Save</button>
        </div>
      </form>)
    }

    renderUserControlItem = ([key, item]) => {
      const ex = this.state.exercise
      const controlType = pathOr('', ['controlType'], item)
      const controlProps = pathOr('', ['controlProps'], item)
      const solution = pathOr('', ['solutions', key], ex)

      return (
        <li key={key}>
          <div className="form-group d-flex justify-content-between align-items-center">
            <select
              name={key}
              className="form-control"
              onChange={this.updateUserControlType}
              value={controlType}
            >
              <option value="">-- Select a control type --</option>
              <option value={SINGLE_CHOICE}>Single choice</option>
              <option value={SINGLE_NUMBER}>Single number</option>
            </select>
            <button
              type="button"
              className="btn btn-sm btn-secondary text-danger mx-1"
              onClick={this.removeUserControl(key)}
            >
              <i className="fa fa-trash"/>
            </button>
          </div>
          <div className="form-group">
            {
              pathOr(false, ['controlType'], item)
                ? <UserControlAdmin
                  controlType={controlType}
                  controlProps={{name: key, value: {...controlProps, solution}, onChange: this.updateSolution}}
                />
                : null
            }
          </div>
        </li>)
    }


    renderPreview() {
      const {classification, description, controls} = this.state.exercise
      return (<div>
        <h4>{classification && classification.subject || <Muted>Subject</Muted>}
          / {classification && classification.topic || <Muted>Topic</Muted>}</h4>
        {
          description
            ? <Markdown source={description}/>
            : <Muted>Description...</Muted>
        }
        {
          (pairsInOrder(controls) || []).map(([key, {controlType, controlProps}]) =>
            <div className="form-group" key={key}>
              <UserControls {...{controlType, controlProps}}/>
            </div>
          )
        }
        <hr/>
        {
          __DEV__
            ? <pre>{
              JSON.stringify(this.state, null, 3)
            }</pre>
            : ''
        }
      </div>)
    }
  })