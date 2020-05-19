import {
  assocPath,
  contains,
  difference,
  evolve,
  filter,
  flip,
  keys,
  last,
  map,
  not,
  omit,
  pathOr,
  pipe,
  prop,
  union,
  values
} from 'ramda'
import * as React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import Select from 'react-select'
import { Button } from 'client-common/component/general/Button'
import {
  changeState,
  EXERCISE_ACTIVE,
  EXERCISE_ARCHIVE,
  EXERCISE_DRAFT,
  EXERCISE_REMOVE
} from 'client-common/services/exercise'
import { openExerciseImageDialog } from 'client-common/store/actions/modal'
import { GRADE, SUBJECT, TAGS, TOPIC } from 'client-common/services/classification'
import { DropdownMenu } from '../../../client-common/component/general/dropdown/DropdownMenu'
import { DropdownToggle } from '../../../client-common/component/general/dropdown/DropdownToggle'
import { Tab } from '../../../client-common/component/general/tab/Tab'
import { ExercisePreview } from '../ExercisePreview'
import { Loading } from 'client-common/component/general/Loading'
import { TabNav } from 'client-common/component/general/tab/TabNav'
import { TextEditor } from 'client-common/component/general/TextEditor'
import { ExerciseState } from '../../components/ExerciseState'
import { FormGroup } from 'client-common/component/general/FormGroup'
import { SubTaskList } from './SubTaskList'
import { getClassifications } from 'client-common/store/classifications'
import {
  cloneExercise,
  loadExercise,
  newExercise,
  saveExercise,
  updateContent
} from './exerciseFormReducer'
import { Icon } from 'client-common/component/general/Icon'
import { isAdmin } from 'client/user/services/user'
import { Dropdown } from 'client-common/component/general/dropdown/Dropdown'
import { CodeEditor } from 'client-common/component/general/CodeEditor'
import { PocketLispProvider } from 'client-common/services/generator/PocketLispProvider'

const modeLabel = {
  Add: 'létrehozása',
  Update: 'módosítása',
  Clone: 'másolása'
}
const TABS = ['Metaadatok', 'Kód', 'Leírás', 'Részfeladatok', 'Előnézet']

const STATE_MESSAGES = {
  [EXERCISE_DRAFT]: 'Biztos, hogy szeretnéd visszállítani a feladtot vázlat állapotba?',
  [EXERCISE_ACTIVE]: 'Valóban szeretnéd aktiválni a feladatot?',
  [EXERCISE_ARCHIVE]: 'Biztos archiválod a feladatot?',
  [EXERCISE_REMOVE]: 'Véglegesen töröljük a feladatot, biztos folytatod?'
}

function mapStateToProps(state) {
  return {
    session: state.app.session,
    classifications: state.app.classifications,
    exercise: state.exerciseEdit.data,
    exerciseMeta: state.exerciseEdit,
    resources: state.resources.data,
    loading: state.app.classifications.loading || state.exerciseEdit.loading,
    error: state.exerciseEdit.error
  }
}
const mapDispatchToProps = {
  getClassifications,
  newExercise,
  loadExercise,
  cloneExercise,
  saveExercise,
  updateContent,
  openExerciseImageDialog
}

export const ExerciseForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  class ExerciseForm extends React.Component<any, any> {
    UNSAFE_componentWillMount() {
      this.props.getClassifications().then(() => this.loadExercise())

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

    saveExercise = event => {
      event.preventDefault()
      if (keys(this.props.exercise.subTasks).length < 1) {
        return alert('Kérlek hozz létre legalább egy részfeladatot')
      }
      this.props.saveExercise()
    }

    changeExerciseState = state => event => {
      if (confirm(STATE_MESSAGES[state])) {
        changeState(this.props.exercise._key, state).then(
          () =>
            state === EXERCISE_REMOVE
              ? window.location.replace('/admin/exercise/')
              : window.location.reload()
        )
      }
    }

    updateContent = fn => {
      this.props.updateContent(fn(this.props.exercise))
    }

    update = event => {
      event = event.currentTarget || event
      const name = event.name
      let value = event.value
      const path = name.split('.')
      if (last(path) === 'difficulty') {
        value = parseInt(value, 10)
      }
      this.updateContent(assocPath(path, value))
    }

    updateClassification = (group, path) => value => {
      const selectedValues = map(prop('_key'), value) as string[]
      let ex = this.props.exercise
      if (last(path) === SUBJECT) {
        // remove all topic(s) which is not connect to any selected subject(s)
        const allNOTUsedSubjectTopics = values(
          omit(selectedValues, pathOr({}, [SUBJECT], ex.classifications))
        ).reduce((acc: any[], sub: any) => acc.concat(Object.keys(sub.topic || {})), [])
        ex = evolve(
          {
            classification: {
              [TOPIC]: filter(
                pipe(
                  flip(contains)(allNOTUsedSubjectTopics),
                  not
                )
              )
            }
          },
          ex
        )
      }
      if (last(path) === TOPIC) {
        // remove and add only the selected topic(s) from the current subject
        const subjectTopics = Object.keys(
          pathOr({}, group.split('.'), this.props.classifications.data)
        )
        const currentTopics = pathOr([], path, ex)
        this.updateContent(
          assocPath(path, union(difference(currentTopics, subjectTopics), selectedValues))
        )
      } else {
        this.updateContent(assocPath(path, selectedValues))
      }
    }

    updateSubTask = subTasks => this.updateContent(assocPath(['subTasks'], subTasks))

    loadExercise = () => {
      const key = this.props.match.params.key
      const cloneKey = this.props.match.params.clone
      if (key) {
        return this.props.loadExercise(key)
      }
      if (cloneKey) {
        return this.props.cloneExercise(cloneKey)
      }
      return this.props.newExercise()
    }

    openExerciseImageDialog = () => {
      this.props.openExerciseImageDialog()
    }

    render() {
      if (this.props.loading) {
        return <Loading />
      } else if (this.props.error) {
        return this.renderError()
      } else {
        return <div>{this.renderContent()}</div>
      }
    }

    renderError() {
      const { error } = this.props
      return (
        <div>
          <div className="alert alert-danger">
            Hiba történt:
            <pre>{error.message || JSON.stringify(error, null, 3)}</pre>
          </div>
          <NavLink exact to="/exercise" className="btn btn-secondary">
            Vissza a feladatlistához
          </NavLink>
        </div>
      )
    }

    renderContent() {
      return (
        <PocketLispProvider seed={1} isEdit={true}>
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
        </PocketLispProvider>
      )
    }

    renderHeader() {
      const { exercise, exerciseMeta } = this.props
      const { mode, saving, changed } = exerciseMeta
      const mLabel = modeLabel[mode]
      const notNew = mode !== 'new'
      const exState = exercise._state
      return (
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex justify-content-between align-items-center">
            <NavLink
              exact
              to="/exercise"
              className="btn btn-outline-light py-0 text-dark mx-2"
              title="Változtatások visszavonása"
            >
              <Icon fa="angle-left" size="2x" />
            </NavLink>
            <h4 className="d-inline-block m-0 mr-1">Feladat {mLabel}</h4>
            <ExerciseState value={exState} />
          </div>
          <div className="d-flex">
            <Dropdown>
              <DropdownToggle className="btn btn-outline-secondary">
                További műveletek
              </DropdownToggle>
              <DropdownMenu>
                {notNew &&
                  exState === EXERCISE_ACTIVE && (
                    <Button
                      className="btn btn-link text-dark"
                      onAction={this.changeExerciseState(EXERCISE_ARCHIVE)}
                      icon="archive"
                    >
                      Archiválás
                    </Button>
                  )}{' '}
                {notNew &&
                  (exState === EXERCISE_DRAFT || exState === EXERCISE_ARCHIVE) && (
                    <Button
                      className="btn btn-link text-success"
                      onAction={this.changeExerciseState(EXERCISE_ACTIVE)}
                      icon="check"
                    >
                      Aktiválás
                    </Button>
                  )}{' '}
                {notNew &&
                  isAdmin(this.props.session.token) && (
                    <Button
                      className="btn btn-link text-danger"
                      onAction={this.changeExerciseState(EXERCISE_REMOVE)}
                      icon="trash"
                    >
                      Törlés
                    </Button>
                  )}{' '}
              </DropdownMenu>
            </Dropdown>

            <Button
              className="btn btn-outline-secondary ml-1"
              onAction={this.openExerciseImageDialog}
              icon="picture-o"
            >
              Képek
            </Button>

            <Button
              loading={saving}
              disabled={!changed}
              className="btn btn-primary ml-1"
              onAction={this.saveExercise}
              icon="save"
            >
              Mentés
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
          return this.renderSourceCode()
        case 2:
          return this.renderDescription()
        case 3:
          return this.renderSubTasks()
        case 4:
          return <ExercisePreview exercise={this.props.exercise} />
      }
    }

    renderMetadata() {
      const ex = this.props.exercise
      const classifications = this.props.classifications.data
      return (
        <div className="col-10 mx-auto">
          {this.renderTextInput('Cím: ', ['title'])}
          {this.renderSelect(GRADE, 'Osztály: ', ['classification', GRADE])}
          {this.renderSelect(SUBJECT, 'Tantárgy: ', ['classification', SUBJECT])}
          {pathOr([], ['classification', 'subject'], ex).map(sub => {
            const label = `${classifications[SUBJECT][sub].name} témakörök`
            return this.renderSelect(`${SUBJECT}.${sub}.${TOPIC}`, label, ['classification', TOPIC])
          })}
          {this.renderSelect(TAGS, 'Címkék: ', ['classification', TAGS])}
          <div className="form-group row">
            <label className="col-4 col-form-label" htmlFor="difficulty">
              Nehézségi szint
            </label>
            <div className="col-8">
              <select
                id="difficulty"
                className="form-control"
                name="difficulty"
                onChange={this.update}
                required
                value={pathOr('', ['difficulty'], ex)}
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

    renderSourceCode() {
      const { exercise } = this.props

      return (
        <div className="col-11 mx-auto">
          <FormGroup label="Teszt seed">
            <input
              type="number"
              className="form-control"
              min={1}
              max={Number.MAX_SAFE_INTEGER}
              step={1}
            />
          </FormGroup>
          <CodeEditor
            name="script"
            onChange={this.update}
            value={pathOr('', ['script'], exercise)}
          />
        </div>
      )
    }

    renderDescription() {
      const { exercise, resources } = this.props
      return (
        <div className="col-11 mx-auto">
          <TextEditor
            className="form-group"
            name="description"
            rows={10}
            required
            onChange={this.update}
            value={pathOr('', ['description'], exercise)}
            resources={resources}
          />
        </div>
      )
    }

    renderSubTasks() {
      return (
        <SubTaskList subTasks={this.props.exercise.subTasks || {}} onChange={this.updateSubTask} />
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
            value={pathOr('', path, this.props.exercise)}
          />
        </FormGroup>
      )
    }

    renderSelect(group, label, path) {
      const classifications = this.props.classifications.data
      return (
        classifications && (
          <FormGroup key={group} label={label}>
            <Select
              value={pathOr([], path, this.props.exercise)}
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
