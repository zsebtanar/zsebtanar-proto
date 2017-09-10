import {
  __,
  assoc,
  assocPath,
  contains,
  difference,
  dissoc,
  evolve,
  filter,
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
import { uid } from 'shared/util/uuid'
import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import Select from 'react-select'
import Button from 'shared/component/general/Button'
import { createExerciseAction, updateExerciseAction } from 'shared/store/actions/exercise'
import { getPrivateExercise } from 'shared/services/exercise'
import { openFileManager, openMarkdownHelpModal } from 'shared/store/actions/modal'
import { getAllClassification, GRADE, SUBJECT, TAGS, TOPIC } from 'shared/services/classification'
import EditUserControls from './EditUserControls'
import EditHints from './EditHints'
import ExercisePreview from './ExercisePreview'
import Loading from 'shared/component/general/Loading'
import { Tab, TabNav } from 'shared/component/general/TabNav'
import TextEditor from 'shared/component/general/TextEditor'

const modeLabel = {
  Add: 'létrehozása',
  Update: 'módosítása',
  Clone: 'másolása'
}
const tabs = ['Kategóriák', 'Leírás', 'Megoldások', 'Útmutatók', 'Előnézet']

export default connect(undefined, {
  openFileManager,
  openMarkdownHelpModal,
  createExerciseAction,
  updateExerciseAction
})(
  class ExerciseForm extends React.Component {
    mode = 'Add'

    state = {
      classifications: null,
      error: null,
      loading: true,
      exercise: null
    }

    componentWillMount() {
      getAllClassification().then(classifications => {
        this.setState({ classifications })
        this.loadExercise()
      })

      document.addEventListener('keyup', this.shiftEnter)
    }

    componentWillUnmount() {
      document.removeEventListener('keyup', this.shiftEnter)
    }

    shiftEnter = event => {
      if (event.keyCode === 13 && event.shiftKey && !/(input|textarea|select)/gi.test(event.target.tagName)) {
        this.saveExercise(event)
      }
    }

    errorHandler = error => this.setState({ error, loading: false })

    setExercise = exercise => {
      this.setState({
        exercise: merge({ controls: {}, solutions: {}, hints: {} }, exercise),
        loading: false
      })
    }

    saveExercise = event => {
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

    update = event => {
      let { name, value } = event.currentTarget || event
      const path = name.split('.')
      if (last(path) === 'difficulty') {
        value = parseInt(value, 10)
      }
      this.setState({ exercise: assocPath(path, value, this.state.exercise) })
    }

    updateClassification = (group, path) => value => {
      this.setState(state => {
        let ex = state.exercise
        const selectedValues = map(prop('_key'), value)
        if (last(path) === SUBJECT) {
          // remove all topic(s) which is not connect to any selected subject(s)
          const allNOTUsedSubjectTopics = values(
            omit(selectedValues, pathOr({}, [SUBJECT], state.classifications))
          ).reduce((acc, sub) => acc.concat(Object.keys(sub.topic || {})), [])
          ex = evolve(
            {
              classification: {
                [TOPIC]: filter(pipe(contains(__, allNOTUsedSubjectTopics), not))
              }
            },
            ex
          )
        }
        if (last(path) === TOPIC) {
          // remove and add only the selected topic(s) from the current subject
          const subjectTopics = Object.keys(pathOr({}, group.split('.'), state.classifications))
          const currentTopics = pathOr([], path, ex)
          return {
            exercise: assocPath(path, union(difference(currentTopics, subjectTopics), selectedValues), ex)
          }
        } else {
          return { exercise: assocPath(path, selectedValues, ex) }
        }
      })
    }

    updateSolution = ({ name, value }) =>
      this.setState(
        evolve({
          exercise: {
            controls: {
              [name]: merge(__, { controlProps: omit(['solution'], value) })
            },
            solutions: merge(__, { [name]: value.solution })
          }
        })
      )

    addUserControl = controlType =>
      this.setState(
        evolve({
          exercise: {
            controls: c => ({
              ...c,
              [uid()]: { order: values(c).length, controlType }
            })
          }
        })
      )

    removeUserControl = key =>
      this.setState(
        evolve({
          exercise: {
            controls: dissoc(key),
            solutions: dissoc(key)
          }
        })
      )

    addHint = text =>
      this.setState(
        evolve({
          exercise: {
            hints: c => ({ ...c, [uid()]: { order: values(c).length, text } })
          }
        })
      )

    updateHint = (key, text) =>
      this.setState(
        evolve({
          exercise: {
            hints: { [key]: merge(__, { text }) }
          }
        })
      )

    removeHint = key =>
      this.setState(
        evolve({
          exercise: { hints: dissoc(key) }
        })
      )

    loadExercise = () => {
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
          .then(ex => assoc('title', `${ex.title || ''} [másolat]`, ex))
          .then(this.setExercise)
          .catch(this.errorHandler)
      }
      return this.setExercise({})
    }

    render() {
      const { loading } = this.state

      return (
        <div>
          {loading && <Loading />}
          {this.renderError()}
          {this.renderContent()}
        </div>
      )
    }

    renderError() {
      const error = this.state.error
      if (error) {
        return (
          <div>
            <div className="alert alert-danger">{error.message || error}</div>
            <NavLink exact to="/exercise" className="btn btn-secondary">
              Vissza a feladatlistához
            </NavLink>
          </div>
        )
      }
    }

    renderContent() {
      const { loading, error, exercise } = this.state
      if (loading || error || !exercise) return
      return (
        <div>
          {this.renderHeader()}

          <form onSubmit={this.saveExercise} className="tab-content w-100">
            <TabNav navClassName="nav-tabs nav-fill w-100 my-4">
              {tabs.map((item, idx) => (
                <Tab key={item} label={item}>
                  {this.renderActiveTabContent(idx)}
                </Tab>
              ))}
            </TabNav>
          </form>
        </div>
      )
    }

    renderHeader() {
      const mLabel = modeLabel[this.mode]
      return (
        <div className="d-flex justify-content-between align-items-center">
          <h4>Feladat {mLabel}</h4>
          <div>
            <NavLink exact to="/exercise" className="btn btn-outline-secondary">
              Mégsem
            </NavLink>{' '}
            <Button className="btn btn-outline-primary" onAction={this.saveExercise}>
              <i className="fa fa-save" /> Mentés
            </Button>
          </div>
        </div>
      )
    }

    renderActiveTabContent(idx) {
      switch (idx) {
        case 0:
          return this.renderCategories()
        case 1:
          return this.renderDescription()
        case 2:
          return this.renderUserControls()
        case 3:
          return this.renderHints()
        case 4:
          return this.renderPreview()
      }
    }

    renderCategories() {
      const ex = this.state.exercise
      return (
        <div className="col-10 mx-auto">
          {this.renderTextInput('Cím: ', ['title'])}
          {this.renderSelect(GRADE, 'Osztály: ', ['classification', GRADE])}
          {this.renderSelect(SUBJECT, 'Tantárgy: ', ['classification', SUBJECT])}
          {pathOr([], ['classification', 'subject'], ex).map(sub => {
            const label = `${this.state.classifications[SUBJECT][sub].name} témakörök`
            return this.renderSelect(`${SUBJECT}.${sub}.${TOPIC}`, label, ['classification', TOPIC])
          })}
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
        </div>
      )
    }

    renderDescription() {
      const ex = this.state.exercise
      return (
        <div className="col-11 mx-auto">
          <TextEditor
            className="form-group"
            name="description"
            rows="10"
            required
            onChange={this.update}
            value={pathOr('', ['description'], ex)}
          />
        </div>
      )
    }

    renderUserControls() {
      return (
        <EditUserControls
          controls={this.state.exercise.controls}
          onAdd={this.addUserControl}
          onUpdate={this.updateSolution}
          onRemove={this.removeUserControl}
        />
      )
    }

    renderHints() {
      return (
        <div className="col-11 mx-auto">
          <EditHints
            hints={this.state.exercise.hints}
            onAdd={this.addHint}
            onUpdate={this.updateHint}
            onRemove={this.removeHint}
          />
        </div>
      )
    }

    renderPreview() {
      return (
        <div className="col-8 mx-auto">
          <ExercisePreview exercise={this.state.exercise} />
        </div>
      )
    }

    renderTextInput(label, path) {
      return (
        <div className="form-group row">
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
        </div>
      )
    }

    renderSelect(group, label, path) {
      const classifications = this.state.classifications
      if (!classifications) return <div />
      return (
        <div key={group} className="form-group row">
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
              onChange={this.updateClassification(group, path)}
            />
          </div>
        </div>
      )
    }
  }
)
