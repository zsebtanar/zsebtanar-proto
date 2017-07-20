import { __, map, prop, assoc, assocPath, dissoc, evolve, identity, merge, omit, pathOr, values } from 'ramda'
import { uid } from 'util/uuid'
import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import Select from 'react-select'
import Markdown from 'shared/component/general/Markdown'
import Button from 'shared/component/general/Button'
import UserControls from 'shared/component/userControls/UserControl'
import UserControlAdmin from 'shared/component/userControls/UserControlAdmin'
import { createExerciseAction, updateExerciseAction } from 'store/actions/exercise'
import { getPrivateExercise } from 'shared/services/exercise'
import { openInputModal, openMarkdownHelpModal } from 'store/actions/modal'
import { SIMPLE_TEXT, SINGLE_CHOICE, SINGLE_NUMBER } from 'shared/component/userControls/controlTypes'
import { pairsInOrder } from 'util/fn'
import { getAllClassification } from 'shared/services/classification'

const Muted = (props) => (<span className="text-muted">{props.children}</span>)

export default connect(undefined, {openInputModal, openMarkdownHelpModal, createExerciseAction, updateExerciseAction})(
  class extends React.Component {
    mode = 'Add'
    state = {
      classifications: null,
      error: null,
      loading: true,
      exercise: null
    }

    componentWillMount () {
      getAllClassification()
        .then(classifications => {
          this.setState({classifications})
          this.loadExercise()
        })
    }

    loadExercise () {
      const key = this.props.match.params.key
      const cloneKey = this.props.match.params.clone
      if (key) {
        this.mode = 'Update'
        return getPrivateExercise(key)
          .then(this.setExercise)
          .catch(this.errorHandler)
      }
      if (cloneKey) {
        this.mode = 'Clone'
        return getPrivateExercise(cloneKey)
          .then(dissoc('_key'))
          .then(ex => assoc('title', `${(ex.title || '')} [másolat]`, ex))
          .then(this.setExercise)
          .catch(this.errorHandler)
      }
      return this.setExercise({})
    }

    errorHandler = (error) => {
      this.setState({error, loading: false})
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

    updateClassification = path => value => {
      this.setState({exercise: assocPath(path, map(prop('_key'), value), this.state.exercise)})
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
          controls: (c) => ({...c, [uid()]: {order: values(c).length, controlType: SIMPLE_TEXT}})
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
      const {loading, error, exercise} = this.state
      const modeLabel = {
        Add: 'létrehozása',
        Update: 'módosítása',
        Clone: 'másolása'
      }[this.mode]

      return (<div>
        {loading && <Muted>Betöltés...</Muted>}
        {error && <div>
          <div className="alert alert-danger">{error.message || error}</div>
          <NavLink exact to="/exercise" className="btn btn-secondary">Vissza a feladatlist</NavLink>
        </div>}
        {!loading && !error && exercise && <div>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Feladat {modeLabel}</h2>
          </div>
          <hr/>
          <div className="row">
            <div className="col-6">{this.renderForm()}</div>
            <div className="col-6">{this.renderPreview()}</div>
          </div>
        </div>}
      </div>
      )
    }

    renderForm () {
      const ex = this.state.exercise
      const controls = pairsInOrder(ex.controls)
      const hints = pairsInOrder(ex.hints)
      return (<form onSubmit={this.saveExercise}>
        {this.renderSelect('grade', 'Osztály: ', ['classification', 'grade'])}
        {this.renderSelect('subject', 'Tantárgy: ', ['classification', 'subject'])}
        {this.renderSelect('topic', 'Témakör: ', ['classification', 'topic'])}
        {this.renderTextInput('Cím: ', ['title'])}
        {this.renderSelect('tags', 'Címkék: ', ['classification', 'tags'])}

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
          <Button title="Add user control" onAction={this.addUserControl}>
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
          <Button title="Add hint" onAction={this.addHint}>
            <i className="fa fa-plus"/>
          </Button>
        </div>

        <div className="my-2">
          <div className="list-group">
            {
              hints.length
                ? hints.map(this.renderHint)
                : <div className="alert alert-info">Megadhatsz egy vagy több tippet a feladat megoldásához</div>
            }
          </div>
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

    renderSelect (group, label, path) {
      const classifications = this.state.classifications
      if (!classifications) return <div/>
      return (<div className="form-group row">
        <label className="col-4 col-form-label">{label}</label>
        <div className="col-8">
          <Select
            value={pathOr([], path, this.state.exercise)}
            multi={true}
            labelKey="name"
            valueKey="_key"
            options={values(classifications[group])}
            onChange={this.updateClassification(path) }
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
              <option value={SIMPLE_TEXT}>Egyszerű szöveg</option>
              <option value={SINGLE_NUMBER}>Szám</option>
              <option value={SINGLE_CHOICE}>Felelet választó</option>
            </select>
            <Button
              className="btn-link text-danger mx-1"
              onAction={this.removeUserControl(key)}
            >
              <i className="fa fa-trash"/>
            </Button>
          </div>
          <div className="form-group col-12">
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

    renderHint = ([key, item], idx) => {
      return (
        <div key={key} className="list-group-item list-group-item-action flex-column align-items-start">
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1 text-muted">{idx + 1}.</h5>
            <div>
              <Button className="btn-sm btn-link" onAction={this.updateHint(key)}>
                <i className="fa fa-edit"/>
              </Button>
              <Button className="btn-sm btn-link text-danger" onAction={this.removeHint(key)}>
                <i className="fa fa-trash"/>
              </Button>
            </div>
          </div>
          <Markdown source={item.text}/>
        </div>
      )
    }

    renderPreview () {
      const {description, controls} = this.state.exercise
      return (<div>
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
              JSON.stringify(this.state.exercise, null, 3)
            }</pre>
            : ''
        }
      </div>)
    }
  })
