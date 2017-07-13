import { __, assoc, assocPath, dissoc, evolve, identity, merge, omit, pathOr, values } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import Markdown from '../../component/general/Markdown'
import { createExerciseAction, updateExerciseAction } from '../../store/actions/exercise'
import { getPrivateExercise } from '../../store/services/exercise'
import { openInputModal, openMarkdownHelpModal } from '../../store/actions/modal'
import UserControls from '../../component/userControls/UserControl'
import UserControlAdmin from '../../component/userControls/UserControlAdmin'
import { SINGLE_CHOICE, SINGLE_NUMBER } from '../../component/userControls/controlTypes'
import { uid } from '../../util/uuid'
import { pairsInOrder } from '../../util/fn'
import Button from '../../component/general/Button'

const Muted = (props) => (<span className="text-muted">{props.children}</span>)

export default connect(undefined, {openInputModal, openMarkdownHelpModal, createExerciseAction, updateExerciseAction})(
  class extends React.Component {
    mode = 'Add'
    state = {
      loading: true,
      exercise: {}
    }

    componentWillMount () {
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
          .then(ex => assoc('title', `${(ex.title || '')} [másolat]`, ex))
          .then(this.setExercise)
      }
      return this.setExercise({})
    }

    setExercise = (exercise) => {
      this.setState({exercise: merge({controls: {}, solutions: {}, hints: {}}, exercise), loading: false})
    }

    saveExercise = (event) => {
      event.preventDefault()
      if (values(this.state.exercise.controls).length < 1) {
        return alert('Kérlek hozz létre legalább egy bevitel mezőt')
      }
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
      this.setState(evolve({
        exercise: {
          controls: {
            [name]: merge(__, {controlProps: omit(['solution'], value)})
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

    addHint = () => {
      this.props.openInputModal({
        title: 'Tipp hozzáadása',
        label: 'Tipp szövege',
        value: '',
        onUpdate: (text) => {
          this.setState(evolve({
            exercise: {
              hints: (c) => ({...c, [uid()]: {order: values(c).length, text}})
            }
          }))
        }
      })
    }

    updateHint = (key) => () => {
      this.props.openInputModal({
        title: 'Tipp módosítása',
        label: 'Tipp szövege',
        value: pathOr('', ['exercise', 'hints', key, 'text'], this.state),
        onUpdate: (text) => {
          this.setState(evolve({
            exercise: {
              hints: {[key]: merge(__, {text})}
            }
          }))
        }
      })
    }

    removeHint = (key) => () => {
      this.setState(evolve({
        exercise: {hints: dissoc(key)}
      }))
    }

    render () {
      const loading = this.state.loading
      const modeLabel = {
        Add: 'létrehozása',
        Update: 'módosítása',
        Clone: 'másolása'
      }[this.mode]

      return loading
        ? (<Muted>Betöltés...</Muted>)
        : (<div>
            <div className="d-flex justify-content-between align-items-center">
              <h2>Feladat {modeLabel}</h2>
            </div>
            <hr/>
            <div className="row">
              <div className="col-6">{this.renderForm()}</div>
              <div className="col-6">{this.renderPreview()}</div>
            </div>
          </div>
        )
    }

    renderForm () {
      const ex = this.state.exercise
      const controls = pairsInOrder(ex.controls)
      const hints = pairsInOrder(ex.hints)
      return (<form onSubmit={this.saveExercise}>
        {this.renderTextInput('Osztály: ', ['classification', 'grade'])}
        {this.renderTextInput('Tantárgy: ', ['classification', 'subject'])}
        {this.renderTextInput('Témakör: ', ['classification', 'topic'])}
        {this.renderTextInput('Cím: ', ['title'])}
        {this.renderTextInput('Címkék: ', ['classification', 'tags'])}

        <div className="form-group">
          <label className="d-flex justify-content-between align-items-center">
            <div>Feladatleírás:</div>
            <Button
              tabIndex="-1"
              className="btn-link"
              onAction={this.props.openMarkdownHelpModal}
            >
              Útmutató szerkesztéshez
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
          <h4>Megoldások</h4>
          <Button primary title="Add user control" onAction={this.addUserControl}>
            <i className="fa fa-plus"/>
          </Button>
        </div>
        <div className="my-2">
          <ol>
            {
              controls.length
                ? controls.map(this.renderUserControlItem)
                : <div className="alert alert-info">Kérlek hozz létre legalább egy bevitel mezőt</div>
            }
          </ol>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <h4>Megoldási útmutatók</h4>
          <Button primary title="Add hint" onAction={this.addHint}>
            <i className="fa fa-plus"/>
          </Button>
        </div>

        <div className="my-2">
          <ol>
            {
              hints.length
                ? hints.map(this.renderHint)
                : <div className="alert alert-info">Megadhatsz egy vagy több tippet a feladat megoldásához</div>
            }
          </ol>
        </div>

        <div className="col-sm-8 offset-sm-4">
          <NavLink exact to="/exercise" className="btn btn-secondary">Mégsem</NavLink>
          &nbsp;
          <Button submit primary>Mentés</Button>
        </div>

      </form>)
    }

    renderTextInput (label, path) {
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
              <option value="">-- Válasz mező típust --</option>
              <option value={SINGLE_CHOICE}>Felelet választó</option>
              <option value={SINGLE_NUMBER}>Szám</option>
            </select>
            <Button
              className="btn-link text-danger mx-1"
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
                  controlProps={{
                    name: key,
                    value: {...controlProps, solution},
                    onChange: this.updateSolution,
                    required: true
                  }}
                />
                : null
            }
          </div>
        </li>)
    }

    renderHint = ([key, item]) => {
      return (<li key={key} className="d-flex align-items-center">
        <Markdown source={item.text}/>
        <Button className="bnt-sm btn-link" onAction={this.updateHint(key)}>
          <i className="fa fa-edit"/>
        </Button>
        <Button className="bnt-sm btn-link text-danger" onAction={this.removeHint(key)}>
          <i className="fa fa-trash"/>
        </Button>
      </li>)
    }

    renderPreview () {
      const {classification, description, controls} = this.state.exercise
      return (<div>
        <h4>{(classification && classification.subject) || <Muted>Tantárgy</Muted>}
          / {(classification && classification.topic) || <Muted>Témakör</Muted>}</h4>
        {
          description
            ? <Markdown source={description}/>
            : <Muted>feladatleírás...</Muted>
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
