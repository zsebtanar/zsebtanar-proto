import { Button } from 'client-common/component/general/Button'
import { FormGroup } from 'client-common/component/general/FormGroup'
import { Icon } from 'client-common/component/general/Icon'
import { Loading } from 'client-common/component/general/Loading'
import { Checkbox } from 'client-common/component/input/Checkbox'
import { pathOr, pipe, view } from 'ramda'
import * as React from 'react'
import { connect } from 'react-redux'
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom'
import { lensPathOr } from 'shared/util/fn'
import { Alert } from '../../../../client-common/component/general/Alert'
import { FormFieldProps } from '../../../store/form/formFields'
import {
  loadExerciseSheet,
  newExerciseSheet,
  saveExerciseSheet,
  setExerciseSheetField
} from '../exerciseSheetReducer'
import { ExerciseSheetItems } from './ExerciseSheetItems'

///

interface StoreProps extends state.AdminExerciseSheet {}

interface DispatchProps {
  createList: typeof newExerciseSheet
  loadList: typeof loadExerciseSheet
  saveList: typeof saveExerciseSheet
  setField: typeof setExerciseSheetField
}

type RouteProps = RouteComponentProps<{ key?: string }>

type AllProps = RouteProps & StoreProps & DispatchProps & FormFieldProps

///

const mapStoreToProps = (state: state.AdminRoot) => state.exerciseSheet

const mapDispatchToProps = {
  createList: newExerciseSheet,
  loadList: loadExerciseSheet,
  saveList: saveExerciseSheet,
  setField: setExerciseSheetField
}

const titleL = lensPathOr('', ['data', 'title'])
const randomOrderL = lensPathOr(false, ['data', 'randomOrder'])
const numOfListedItemsL = lensPathOr(0, ['data', 'numOfListedItems'])

///

export const ExerciseSheetForm = pipe(
  withRouter,
  connect<StoreProps, DispatchProps, RouteProps & FormFieldProps>(
    mapStoreToProps,
    mapDispatchToProps
  )
)(
  class ExerciseSheetFormComp extends React.PureComponent<AllProps> {
    componentWillMount(): void {
      this.loadList()
    }

    private loadList = () => {
      const { key } = this.props.match.params

      if (key) {
        this.props.loadList(key)
      } else {
        this.props.createList()
      }
    }

    render(): React.ReactNode {
      const { loading, error } = this.props
      return (
        <div>
          {this.renderHeader()}
          {loading ? (
            <Loading />
          ) : error ? (
            <Alert type={'danger'}>{JSON.stringify(error)}</Alert>
          ) : (
            this.renderContent()
          )}
        </div>
      )
    }

    private renderHeader() {
      const { saving, changed } = this.props

      return (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <NavLink
              exact
              to="/exercise-list"
              className="btn btn-outline-light py-0 text-dark mx-2"
              title="Mégsem"
            >
              <Icon fa="angle-left" size="2x" />
            </NavLink>
            <h4 className="d-inline-block m-0 mr-1">Feladatlista</h4>
          </div>
          <Button
            loading={saving}
            disabled={!changed}
            className="btn btn-primary ml-1"
            onAction={this.props.saveList}
            icon="save"
          >
            Mentés
          </Button>
        </div>
      )
    }

    private renderContent() {
      const { data, setField } = this.props
      return (
        <div className="row">
          <div className="col-10 mx-auto">
            <FormGroup label="Feladatsor neve">
              <input
                className="form-control"
                type="text"
                name="title"
                required
                onChange={e => setField(titleL, e.currentTarget.value)}
                value={view(titleL, this.props)}
              />
            </FormGroup>
            <FormGroup label="Véletlenszerű sorrend">
              <Checkbox
                name="randomOrder"
                onChange={e => setField(randomOrderL, e.currentTarget.checked)}
                checked={view(randomOrderL, this.props)}
              />
            </FormGroup>
            <FormGroup label="Megoldandó feladatok száma">
              <input
                className="form-control"
                type="number"
                name="exerciseCount"
                required
                min={0}
                max={pathOr(0, ['items', 'length'], data)}
                disabled={pathOr(false, ['items', 'length'], data) === false}
                onChange={e => setField(numOfListedItemsL, e.currentTarget.value)}
                value={view(numOfListedItemsL, this.props)}
              />
            </FormGroup>
            <hr />
            <ExerciseSheetItems items={data.items} onChange={console.log} />
          </div>
        </div>
      )
    }
  }
)
