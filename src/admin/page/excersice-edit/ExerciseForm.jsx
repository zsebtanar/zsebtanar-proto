import {
  __,
  assoc,
  assocPath,
  contains,
  difference,
  dissoc,
  evolve,
  filter,
  identity,
  last,
  map,
  merge,
  not,
  omit,
  pathOr,
  pipe,
  prop,
  union,
  values
} from 'ramda'
import { uid } from 'util/uuid'
import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import Select from 'react-select'
import Button from 'shared/component/general/Button'
import UserControlAdmin from 'shared/component/userControls/UserControlAdmin'
import { createExerciseAction, updateExerciseAction } from 'store/actions/exercise'
import { getPrivateExercise } from 'shared/services/exercise'
import { openMarkdownHelpModal } from 'store/actions/modal'
import { SIMPLE_TEXT, SINGLE_CHOICE, SINGLE_NUMBER } from 'shared/component/userControls/controlTypes'
import { pairsInOrder } from 'util/fn'
import { getAllClassification, GRADE, SUBJECT, TAGS, TOPIC } from 'shared/services/classification'
import EditHints from './EditHints.jsx'
import ExercisePreview from './ExercisePreview'

const Muted = (props) => (<span className="text-muted">{props.children}</span>)

export default connect(undefined, {openMarkdownHelpModal, createExerciseAction, updateExerciseAction})(
  class ExerciseForm extends React.Component {
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
      let {name, value} = event.currentTarget || event
      const path = name.split('.')
      if (last(path) === 'difficulty') {
        value = parseInt(value, 10)
      }
      this.setState({exercise: assocPath(path, value, this.state.exercise)})
    }

    updateClassification = (group, path) => value => {
      this.setState((state) => {
        let ex = state.exercise
        const selectedValues = map(prop('_key'), value)
        if (last(path) === SUBJECT) {
          // remove all topic(s) which is not connect to any selected subject(s)
          const allNOTUsedSubjectTopics = values(omit(selectedValues, pathOr({}, [SUBJECT], state.classifications))).reduce((acc, sub) => acc.concat(Object.keys(sub.topic || {})), [])
          ex = evolve({
            classification: {
              [TOPIC]: filter(pipe(contains(__, allNOTUsedSubjectTopics), not))
            }
          }, ex)
        }
        if (last(path) === TOPIC) {
          // remove and add only the selected topic(s) from the current subject
          const subjectTopics = Object.keys(pathOr({}, group.split('.'), state.classifications))
          const currentTopics = pathOr([], path, ex)
          return {exercise: assocPath(path, union(difference(currentTopics, subjectTopics), selectedValues), ex)}
        } else {
          return {exercise: assocPath(path, selectedValues, ex)}
        }
      })
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

    addHint = (text) =>
      this.setState(evolve({
        exercise: {
          hints: (c) => ({...c, [uid()]: {order: values(c).length, text}})
        }
      }))

    updateHint = (key, text) =>
      this.setState(evolve({
        exercise: {
          hints: {[key]: merge(__, {text})}
        }
      }))

    removeHint = (key) =>
      this.setState(evolve({
        exercise: {hints: dissoc(key)}
      }))

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
            <div className="col-6">
              <ExercisePreview exercise={exercise} />
            </div>
          </div>
        </div>}
      </div>
      )
    }

    renderForm () {
      const ex = this.state.exercise
      const controls = pairsInOrder(ex.controls)

      return (<form onSubmit={this.saveExercise}>
        {this.renderSelect(GRADE, 'Osztály: ', ['classification', GRADE])}
        {this.renderSelect(SUBJECT, 'Tantárgy: ', ['classification', SUBJECT])}
        {pathOr([], ['classification', 'subject'], ex).map(sub => {
          const label = `${this.state.classifications[SUBJECT][sub].name} témakörök`
          return this.renderSelect(`${SUBJECT}.${sub}.${TOPIC}`, label, ['classification', TOPIC])
        })}
        {this.renderTextInput('Cím: ', ['title'])}
        {this.renderSelect(TAGS, 'Címkék: ', ['classification', TAGS])}

        <div className="form-group row">
          <label className="col-4 col-form-label">Nehézségi szint</label>
          <div className="col-8">
            <select
              className="form-control"
              name="classification.difficulty"
              onChange={this.update}
              required
              value={pathOr('', ['classification', 'difficulty'], this.state.exercise)}
            >
              <option value={0}>Könnyű</option>
              <option value={5}>Közepes</option>
              <option value={10}>Nehéz</option>
            </select>
          </div>
        </div>

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

        <EditHints
          hints={ex.hints}
          onAdd={this.addHint}
          onUpdate={this.updateHint}
          onRemove={this.removeHint}
        />

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
      return (<div key={group} className="form-group row">
        <label className="col-4 col-form-label">{label}</label>
        <div className="col-8">
          <Select
            value={pathOr([], path, this.state.exercise)}
            multi={true}
            labelKey="name"
            valueKey="_key"
            tabSelectsValue={false}
            matchProp="label"
            placeholder="Válasszon egyet..."
            options={values(pathOr({}, group.split('.'), classifications))}
            onChange={this.updateClassification(group, path) }
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
  })
