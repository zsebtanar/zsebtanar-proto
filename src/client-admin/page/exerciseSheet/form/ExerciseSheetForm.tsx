import { Button } from 'client-common/component/general/Button'
import { FormGroup } from 'client-common/component/general/FormGroup'
import { Icon } from 'client-common/component/general/Icon'
import { Loading } from 'client-common/component/general/Loading'
import { Checkbox } from 'client-common/component/input/Checkbox'
import { pathOr, view } from 'ramda'
import * as React from 'react'
import { connect } from 'react-redux'
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom'
import { lensPathOr } from 'shared/util/fn'
import { Alert } from 'client-common/component/general/Alert'
import { FormFieldProps } from '../../../store/form/formFields'
import {
  clearExerciseSheet,
  loadExerciseSheet,
  newExerciseSheet,
  removeExerciseSheet,
  saveExerciseSheet,
  setExerciseSheetField
} from '../exerciseSheetReducer'
import { ExerciseSheetItems } from './ExerciseSheetItems'

///

interface StoreProps extends state.AdminExerciseSheet {}

interface DispatchProps {
  createSheet: typeof newExerciseSheet
  loadSheet: typeof loadExerciseSheet
  saveSheet: typeof saveExerciseSheet
  removeSheet: typeof removeExerciseSheet
  clearSheet: typeof clearExerciseSheet
  setField: typeof setExerciseSheetField
}

type RouteProps = RouteComponentProps<{ key?: string }>

///

const mapStoreToProps = (state: state.AdminRoot) => state.exerciseSheet

const mapDispatchToProps: DispatchProps = {
  createSheet: newExerciseSheet,
  loadSheet: loadExerciseSheet,
  saveSheet: saveExerciseSheet,
  removeSheet: removeExerciseSheet,
  clearSheet: clearExerciseSheet,
  setField: setExerciseSheetField
}

const titleL = lensPathOr('', ['data', 'title'])
const randomOrderL = lensPathOr(false, ['data', 'randomOrder'])
const numOfListedItemsL = lensPathOr(0, ['data', 'numOfListedItems'])

///

export const ExerciseSheetForm = withRouter(
  connect<StoreProps, DispatchProps, RouteProps & FormFieldProps>(
    mapStoreToProps,
    mapDispatchToProps
  )(
    class ExerciseSheetFormComp extends React.PureComponent<any> {
      UNSAFE_componentWillMount(): void {
        this.loadSheet()
      }

      componentWillUnmount(): void {
        this.props.clearSheet()
      }

      private loadSheet = () => {
        const { key } = this.props.match.params

        if (key) {
          this.props.loadSheet(key)
        } else {
          this.props.createSheet()
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
        const { saving, changed, data } = this.props

        return (
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <NavLink
                exact
                to="/exercise-sheet"
                className="btn btn-outline-light py-0 text-dark mx-2"
                title="Mégsem"
              >
                <Icon fa="angle-left" size="2x" />
              </NavLink>
              <h4 className="d-inline-block m-0 mr-1">Feladatlista</h4>
            </div>
            <div>
              {data &&
                data.id && (
                  <Button
                    className="btn btn-outline-danger"
                    onAction={this.props.removeSheet}
                    icon="trash"
                  >
                    Törlés
                  </Button>
                )}
              <Button
                loading={saving}
                disabled={!changed}
                className="btn btn-primary ml-1"
                onAction={this.props.saveSheet}
                icon="save"
              >
                Mentés
              </Button>
            </div>
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
              <FormGroup
                label="Megoldandó feladatok száma"
                helpText="0 érték esetén minden feladat elérhető lesz."
              >
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
              <ExerciseSheetItems items={data.items} />
            </div>
          </div>
        )
      }
    }
  )
)
