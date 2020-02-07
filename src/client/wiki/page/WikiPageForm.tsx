import { Alert } from 'client-common/component/general/Alert'
import { Button } from 'client-common/component/general/Button'
import { FormGroup } from 'client-common/component/general/FormGroup'
import { Icon } from 'client-common/component/general/Icon'
import { Loading } from 'client-common/component/general/Loading'
import { TextEditor } from 'client-common/component/general/TextEditor'
import { pipe, view } from 'ramda'
import * as React from 'react'
import { connect } from 'react-redux'
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom'
import { lensPathOr } from '../../../../shared/util/fn'
import { FormFieldProps } from 'X-client-admin/store/form/formFields'
import {
  clearWikiPage,
  loadWikiPage,
  newWikiPage,
  removeWikiPage,
  saveWikiPage,
  setWikiPageField
} from 'client/app-admin/pages/wiki/wikiReducer'

///

interface StoreProps {
  wiki: state.AdminWikPage
  resources: state.AdminResource['data']
}

interface DispatchProps {
  createPage: typeof newWikiPage
  loadPage: typeof loadWikiPage
  savePage: typeof saveWikiPage
  removePage: typeof removeWikiPage
  clearPage: typeof clearWikiPage
  setField: typeof setWikiPageField
}

type RouteProps = RouteComponentProps<{ key?: string }>

type AllProps = RouteProps & StoreProps & DispatchProps & FormFieldProps

///

const mapStoreToProps = (state: state.AdminRoot) => {
  return {
    wiki: state.wikiPage,
    resources: state.resources.data
  }
}

const mapDispatchToProps = {
  createPage: newWikiPage,
  loadPage: loadWikiPage,
  savePage: saveWikiPage,
  removePage: removeWikiPage,
  clearPage: clearWikiPage,
  setField: setWikiPageField
}

///

const titleL = lensPathOr('', ['data', 'title'])
const contentL = lensPathOr(false, ['data', 'content'])

///

export const WikiPageForm = pipe(
  withRouter,
  connect<StoreProps, DispatchProps, RouteProps & FormFieldProps>(
    mapStoreToProps,
    mapDispatchToProps
  )
)(
  class ExerciseSheetFormComp extends React.PureComponent<AllProps> {
    componentWillMount(): void {
      this.loadPage()
    }

    componentWillUnmount(): void {
      this.props.clearPage()
    }

    private loadPage = () => {
      const { key } = this.props.match.params

      if (key) {
        this.props.loadPage(key)
      } else {
        this.props.createPage()
      }
    }

    render(): React.ReactNode {
      const { loading, error } = this.props.wiki
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
      const { saving, changed, data } = this.props.wiki

      return (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <NavLink
              exact
              to="/wiki-page"
              className="btn btn-outline-light py-0 text-dark mx-2"
              title="Mégsem"
            >
              <Icon fa="angle-left" size="2x" />
            </NavLink>
            <h4 className="d-inline-block m-0 mr-1">Wiki oldal</h4>
          </div>
          <div>
            {data &&
              data.id && (
                <Button
                  className="btn btn-outline-danger"
                  onAction={this.props.removePage}
                  icon="trash"
                >
                  Törlés
                </Button>
              )}
            <Button
              loading={saving}
              disabled={!changed}
              className="btn btn-primary ml-1"
              onAction={this.props.savePage}
              icon="save"
            >
              Mentés
            </Button>
          </div>
        </div>
      )
    }

    private renderContent() {
      const { setField, wiki, resources } = this.props
      return (
        <div className="row">
          <div className="col-10 mx-auto">
            <FormGroup label="Wiki oldal címe">
              <input
                className="form-control"
                type="text"
                name="title"
                required
                onChange={e => setField(titleL, e.currentTarget.value)}
                value={view(titleL, wiki)}
              />
            </FormGroup>

            <div>
              <TextEditor
                className="form-group"
                name="description"
                rows={10}
                required
                onChange={e => setField(contentL, e.value)}
                value={view(contentL, wiki)}
                resources={resources}
              />
            </div>
          </div>
        </div>
      )
    }
  }
)
