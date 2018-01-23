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
  values,
  keys
} from 'ramda'
import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import Select from 'react-select'
import Button from 'shared/component/general/Button'
import {
  changeState,
  createExercise,
  EXERCISE_ACTIVE,
  EXERCISE_ARCHIVE,
  EXERCISE_DRAFT,
  EXERCISE_REMOVE,
  getPrivateExercise,
  updateExercise
} from 'shared/services/exercise'
import { openFileManager, openMarkdownHelpModal } from 'shared/store/actions/modal'
import { getAllClassification, GRADE, SUBJECT, TAGS, TOPIC } from 'shared/services/classification'
import { ExercisePreview } from '../ExercisePreview'
import Loading from 'shared/component/general/Loading'
import { Tab, TabNav } from 'shared/component/general/TabNav'
import TextEditor from 'shared/component/general/TextEditor'
import ExerciseState from 'admin/components/ExerciseState'
import FormGroup from 'shared/component/general/FormGroup'
import SubTaskList from 'admin/page/excersice-edit/SubTaskList'

const modeLabel = {
  Add: 'létrehozása',
  Update: 'módosítása',
  Clone: 'másolása'
}
const TABS = ['Metaadatok', 'Leírás', 'Részfeladatok', 'Előnézet']

const STATE_MESSAGES = {
  [EXERCISE_DRAFT]: 'Biztos, hogy szeretnéd visszállítani a feladtot vázlat állapotba?',
  [EXERCISE_ACTIVE]: 'Valóban szeretnéd aktiválni a feladatot?',
  [EXERCISE_ARCHIVE]: 'Biztos archiválod a feladatot?',
  [EXERCISE_REMOVE]: 'Véglegesen töröljük a feladatot, biztos folytatod?'
}

export default connect(undefined, {
  openFileManager,
  openMarkdownHelpModal
})(
  class ExerciseForm extends React.Component {
    mode = 'Add'

    state = {
      classifications: null,
      error: null,
      loading: true,
      saving: false,
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
      if (
        event.keyCode === 13 &&
        event.shiftKey &&
        !/(input|textarea|select)/gi.test(event.target.tagName)
      ) {
        this.saveExercise(event)
      }
    }

    errorHandler = error => this.setState({ error, loading: false })

    setExercise = exercise => {
      this.setState({
        exercise: merge({}, exercise),
        loading: false
      })
    }

    saveExercise = event => {
      event.preventDefault()
      if (keys(this.state.exercise.subTasks).length < 1) {
        return alert('Kérlek hozz létre legalább egy részfeladatot')
      }
      const ex = this.state.exercise
      if (ex._key) {
        updateExercise(ex._key, ex).then(this.saveSuccess)
      } else {
        createExercise(ex).then(this.saveSuccess)
      }
      this.setState({ saving: true })
    }

    changeExerciseState = state => event => {
      if (confirm(STATE_MESSAGES[state])) {
        this.setState({ saving: true })
        changeState(this.state.exercise._key, state).then(this.saveSuccess)
      }
    }

    saveSuccess = () => {
      this.setState({ saving: false })
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
            exercise: assocPath(
              path,
              union(difference(currentTopics, subjectTopics), selectedValues),
              ex
            )
          }
        } else {
          return { exercise: assocPath(path, selectedValues, ex) }
        }
      })
    }

    updateSubTask = subTasks => this.setState(assocPath(['exercise', 'subTasks'], subTasks))

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

          <div className="tab-content w-100">
            <TabNav navClassName="nav-tabs nav-fill w-100 mt-4 mb-2" defaultTab={0}>
              {TABS.map((item, idx) => (
                <Tab key={item} label={item}>
                  {this.renderActiveTabContent(idx)}
                </Tab>
              ))}
            </TabNav>
          </div>
        </div>
      )
    }

    renderHeader() {
      const mLabel = modeLabel[this.mode]
      const exercise = this.state.exercise
      const notNew = !!this.state.exercise._key
      const exState = exercise._state
      return (
        <div className="d-flex justify-content-between align-items-center">
          <h4>Feladat {mLabel}</h4>
          <ExerciseState value={exState} />
          <div>
            {notNew &&
            exState === EXERCISE_ACTIVE && (
              <Button
                className="btn btn-link text-dark"
                onAction={this.changeExerciseState(EXERCISE_ARCHIVE)}
              >
                <i className="fa fa-archive" /> Arhiválás
              </Button>
            )}{' '}
            {notNew &&
            (exState === EXERCISE_DRAFT || exState === EXERCISE_ARCHIVE) && (
              <Button
                className="btn btn-link text-success"
                onAction={this.changeExerciseState(EXERCISE_ACTIVE)}
              >
                <i className="fa fa-check" /> Aktiválás
              </Button>
            )}{' '}
            {notNew &&
            exState === EXERCISE_DRAFT && (
              <Button
                className="btn btn-link text-danger"
                onAction={this.changeExerciseState(EXERCISE_REMOVE)}
              >
                <i className="fa fa-trash" /> Törlés
              </Button>
            )}{' '}
            <NavLink exact to="/exercise" className="btn btn-outline-secondary">
              Mégsem
            </NavLink>{' '}
            <Button
              loading={this.state.saving}
              className="btn btn-outline-primary"
              onAction={this.saveExercise}
            >
              <i className="fa fa-save" /> Mentés
            </Button>
          </div>
        </div>
      )
    }

    renderActiveTabContent(idx) {
      switch (idx) {
        case 0:
          return this.renderMetadata()
        case 1:
          return this.renderDescription()
        case 2:
          return this.renderSubTasks()
        case 3:
          return <ExercisePreview exercise={this.state.exercise} />
      }
    }

    renderMetadata() {
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

    renderSubTasks() {
      return (
        <SubTaskList subTasks={this.state.exercise.subTasks || {}} onChange={this.updateSubTask} />
      )
    }

    renderTextInput(label, path) {
      return (
        <FormGroup label={label}>
          <input
            className="form-control"
            type="text"
            name={path.join('.')}
            onChange={this.update}
            required
            value={pathOr('', path, this.state.exercise)}
          />
        </FormGroup>
      )
    }

    renderSelect(group, label, path) {
      const classifications = this.state.classifications
      return (
        classifications && (
          <FormGroup key={group} label={label}>
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
          </FormGroup>
        )
      )
    }
  }
)
