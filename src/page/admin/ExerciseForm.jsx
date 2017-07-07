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
import Button from '../../component/general/Button'

const Muted = (props) => (<span className="text-muted">{props.children}</span>)

export default connect(undefined, {openMarkdownHelpModal, createExerciseAction, updateExerciseAction})(
  class extends React.Component {
    mode = 'Add'
    state = {
      loading: true,
      exercise: {}
    }

    componentWillMount() {
      const key = this.props.match.params.key
      const cloneKey = this.props.match.params.clone
      if (key) {
        this.mode = 'Update'
        return getPrivateExercise(key)
          .then(this.setExercise)
      }
      if (cloneKey) {
        this.mode = 'Clone'
        return getPrivateExercise(cloneKey)
          .then(dissoc('_key'))
          .then(ex => assoc('title', `${(ex.title || '')} [copy]`, ex))
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
      const loading = this.state.loading

      return loading
        ? (<Muted>Loading...</Muted>)
        : (<div>
            <div className="d-flex justify-content-between align-items-center">
              <h2>{this.mode} exercise</h2>
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
        {this.renderTextInput('Grade: ', ['classification', 'grade'])}
        {this.renderTextInput('Subject: ', ['classification', 'subject'])}
        {this.renderTextInput('Topic: ', ['classification', 'topic'])}
        {this.renderTextInput('Title: ', ['title'])}
        {this.renderTextInput('Tags: ', ['classification', 'tags'])}

        <div className="form-group">
          <label className="d-flex justify-content-between align-items-center">
            <div>Description:</div>
            <Button
              tabIndex="-1"
              className="btn-link"
              onAction={this.props.openMarkdownHelpModal}
            >
              Help for markdown
            </Button>

          </label>
          <textarea
            className="form-control"
            name="description"
            rows="10"
            required
            onChange={this.update}
            value={pathOr('', ['description'], ex)}
          />
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <h4>User controls</h4>
          <Button primary title="Add user control" onAction={this.addUserControl}>
            <i className="fa fa-plus"/>
          </Button>
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
          <Button submit primary>Save</Button>
        </div>
      </form>)
    }

    renderTextInput(label, path){
      console.log(pathOr('', path, this.state.exercise))
      return (<div className="form-group row">
        <label className="col-4 col-form-label">{label}</label>
        <div className="col-8">
          <input
            className="form-control"
            type="text"
            name={path.join('.')}
            onChange={this.update}
            required
            value={pathOr('', path, this.state.exercise)}
          />
        </div>
      </div>)
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
              required
              value={controlType}
            >
              <option value="">-- Select a control type --</option>
              <option value={SINGLE_CHOICE}>Single choice</option>
              <option value={SINGLE_NUMBER}>Single number</option>
            </select>
            <Button
              className="btn-secondary text-danger mx-1"
              onAction={this.removeUserControl(key)}
            >
              <i className="fa fa-trash"/>
            </Button>
          </div>
          <div className="form-group">
            {
              pathOr(false, ['controlType'], item)
                ? <UserControlAdmin
                  controlType={controlType}
                  controlProps={{name: key, value: {...controlProps, solution}, onChange: this.updateSolution, required: true}}
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