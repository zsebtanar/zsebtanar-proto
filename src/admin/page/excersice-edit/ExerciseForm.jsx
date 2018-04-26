import {
  __,
  assocPath,
  contains,
  difference,
  evolve,
  filter,
  last,
  map,
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
  EXERCISE_ACTIVE,
  EXERCISE_ARCHIVE,
  EXERCISE_DRAFT,
  EXERCISE_REMOVE
} from 'shared/services/exercise'
import { openExerciseImageDialog } from 'shared/store/actions/modal'
import { GRADE, SUBJECT, TAGS, TOPIC } from 'shared/services/classification'
import { ExercisePreview } from '../ExercisePreview'
import Loading from 'shared/component/general/Loading'
import { Tab, TabNav } from 'shared/component/general/TabNav'
import { TextEditor } from 'shared/component/general/TextEditor'
import ExerciseState from 'admin/components/ExerciseState'
import FormGroup from 'shared/component/general/FormGroup'
import SubTaskList from 'admin/page/excersice-edit/SubTaskList'
import { getClassifications } from 'shared/store/classifications'
import {
  cloneExercise,
  loadExercise,
  newExercise,
  updateContent,
  saveExercise
} from 'admin/store/exerciseEdit'
import Icon from 'shared/component/general/Icon'
import { isAdmin } from '../../../shared/services/user'
import { Dropdown, DropdownMenu, DropdownToggle } from '../../../shared/ui/Dropdown'

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

function mapStateToProps(state) {
  return {
    session: state.app.session,
    classifications: state.app.classifications,
    exercise: state.exerciseEdit,
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

export default connect(mapStateToProps, mapDispatchToProps)(
  class ExerciseForm extends React.Component {
    componentWillMount() {
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
      if (keys(this.props.exercise.data.subTasks).length < 1) {
        return alert('Kérlek hozz létre legalább egy részfeladatot')
      }
      this.props.saveExercise()
    }

    changeExerciseState = state => event => {
      if (confirm(STATE_MESSAGES[state])) {
        changeState(this.props.exercise.data._key, state).then(
          () =>
            state === EXERCISE_REMOVE
              ? (window.location = '/admin/exercise/')
              : window.location.reload()
        )
      }
    }

    updateContent = fn => {
      this.props.updateContent(fn(this.props.exercise.data))
    }

    update = event => {
      let { name, value } = event.currentTarget || event
      const path = name.split('.')
      if (last(path) === 'difficulty') {
        value = parseInt(value, 10)
      }
      this.updateContent(assocPath(path, value))
    }

    updateClassification = (group, path) => value => {
      const selectedValues = map(prop('_key'), value)
      let ex = this.props.exercise.data
      if (last(path) === SUBJECT) {
        // remove all topic(s) which is not connect to any selected subject(s)
        const allNOTUsedSubjectTopics = values(
          omit(selectedValues, pathOr({}, [SUBJECT], ex.classifications))
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
      const { data: exercise, mode, saving, changed } = this.props.exercise
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
          return this.renderDescription()
        case 2:
          return this.renderSubTasks()
        case 3:
          return <ExercisePreview exercise={this.props.exercise.data} />
      }
    }

    renderMetadata() {
      const ex = this.props.exercise.data
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
            <label className="col-4 col-form-label">Nehézségi szint</label>
            <div className="col-8">
              <select
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

    renderDescription() {
      const { data, resources } = this.props.exercise
      return (
        <div className="col-11 mx-auto">
          <TextEditor
            className="form-group"
            name="description"
            rows="10"
            required
            onChange={this.update}
            value={pathOr('', ['description'], data)}
            resources={resources}
          />
        </div>
      )
    }

    renderSubTasks() {
      return (
        <SubTaskList
          subTasks={this.props.exercise.data.subTasks || {}}
          onChange={this.updateSubTask}
        />
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
            value={pathOr('', path, this.props.exercise.data)}
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
              value={pathOr([], path, this.props.exercise.data)}
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
