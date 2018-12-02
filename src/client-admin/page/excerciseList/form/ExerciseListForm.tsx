import { Button } from 'client-common/component/general/Button'
import { FormGroup } from 'client-common/component/general/FormGroup'
import { Icon } from 'client-common/component/general/Icon'
import { pipe, pathOr } from 'ramda'
import * as React from 'react'
import { connect } from 'react-redux'
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom'
import { Loading } from 'client-common/component/general/Loading'
import { FormFieldProps } from '../../../store/form/formFields'
import {
  loadExerciseList,
  newExerciseList,
  saveExerciseList,
  setExerciseListField
} from '../exerciseListFormReducer'
import { ExerciseListItems } from './ExerciseListItems'

///

interface StoreProps extends state.AdminExerciseList {}

interface DispatchProps {
  createList: typeof newExerciseList
  loadList: typeof loadExerciseList
  saveList: typeof saveExerciseList
  setField: typeof setExerciseListField
}

type RouteProps = RouteComponentProps<{ key?: string }>

type AllProps = RouteProps & StoreProps & DispatchProps & FormFieldProps

///

const mapStoreToProps = (state: state.AdminRoot) => state.exerciseList

const mapDispatchToProps = {
  createList: newExerciseList,
  loadList: loadExerciseList,
  saveList: saveExerciseList,
  setField: setExerciseListField
}

///

export const ExerciseListForm = pipe(
  withRouter,
  connect<StoreProps, DispatchProps, RouteProps & FormFieldProps>(
    mapStoreToProps,
    mapDispatchToProps
  )
)(
  class ExerciseListFormComp extends React.PureComponent<AllProps> {
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
      const { loading } = this.props
      return (
        <div>
          {this.renderHeader()}
          {loading ? <Loading /> : this.renderContent()}
        </div>
      )
    }

    private renderHeader() {
      const { saving, changed } = this.props

      return (
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex justify-content-between align-items-center">
            <NavLink
              exact
              to="/exercise-list"
              className="btn btn-outline-light py-0 text-dark mx-2"
              title="Változtatások visszavonása"
            >
              <Icon fa="angle-left" size="2x" />
            </NavLink>
            <h4 className="d-inline-block m-0 mr-1">Feladatlista</h4>
          </div>
          <div className="d-flex">
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
        </div>
      )
    }

    private renderContent() {
      const { data, setField } = this.props
      const p = ['data', 'title']
      return (
        <div className="row">
          <div className="col-10 mx-auto">
            <FormGroup label="Feladatsor neve">
              <input
                className="form-control"
                type="text"
                name="title"
                required
                onChange={e => setField(p, e.currentTarget.value)}
                value={pathOr('', p, this.props)}
              />
            </FormGroup>
            <hr />
            <ExerciseListItems items={data.items} onChange={console.log} />
          </div>
        </div>
      )
    }
  }
)
