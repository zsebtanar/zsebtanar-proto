import * as React from 'react'
import * as ReactGA from 'react-ga'
import * as algoliasearch from 'algoliasearch'
import { connect } from 'react-redux'
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom'
import { Markdown } from 'client-common/component/general/Markdown'
import { Loading } from 'client-common/component/general/Loading'
import { Icon } from 'client-common/component/general/Icon'
import { search } from 'client-common/services/search'
import { getQueryParams } from 'client-common/util/url'
import { setupPage } from 'client-common/component/hoc/setupPage'
import { pipe } from 'ramda'

interface StoreProps {
  session: state.Session
}

interface State {
  loading: boolean
  term: string
  list?: algoliasearch.Response
  error?: any
}

type RouteProps = RouteComponentProps<{ search: string }>

const mapStateToProps = state => ({
  session: state.app.session
})

export const Search = pipe(
  setupPage({ storePosition: false }),
  withRouter,
  connect<StoreProps, RouteProps>(mapStateToProps)
)(
  class Search extends React.Component<StoreProps & RouteProps, State> {
    state = {
      list: undefined,
      error: undefined,
      loading: false,
      term: ''
    }

    private searchInput

    componentDidMount() {
      const searchTerm = getQueryParams(this.props.history.location.search, 'q')
      if (searchTerm) {
        this.searchInput.value = searchTerm
        this.searchTerm(searchTerm)
      }
    }

    onSearch = event => this.searchTerm(event.currentTarget.value)

    searchTerm = term => {
      if (term.length >= 2) {
        this.setState({ loading: true, list: undefined })
        this.props.history.push({ search: `q=${term}` })

        search(term)
          .then(list => {
            this.setState({ list, error: undefined, loading: false, term })
            if (list) { ReactGA.event({ category: 'User', action: 'Search results', label: term, value: list.nbHits })}
          })
          .catch(error => this.setState({ error, loading: false }))
      } else {
        this.props.history.push({ search: `` })
        this.setState({ loading: false, list: undefined, term: '' })
      }
    }

    getInputRef = ref => (this.searchInput = ref)

    render() {
      return (
        <div>
          <div className="mb-4 mx-auto col-md-8">
            <div className="search-input-group ">
              <label className="search-label" htmlFor="search-input">
                <Icon fa="search" size="lg" />
                <span className="sr-only">Feladat keresés</span>
              </label>
              <input
                id="search-input"
                ref={this.getInputRef}
                type="text"
                className="form-control"
                onInput={this.onSearch}
                placeholder="Feladat keresés ..."
                autoFocus
              />
            </div>
          </div>
          {this.renderContent()}
        </div>
      )
    }

    private renderContent() {
      const { list, loading, error } = this.state

      if (loading) return <Loading />
      if (error) return this.renderError()
      if (list) {
        if (list.nbHits > 0) return this.renderResult()
        return Search.renderEmpty
      }
      return Search.renderInfo()
    }

    private renderResult() {
      const { list, term } = this.state
      return (
        <div className="list-group col-md-10 mx-auto">
          <div className="mb-4 text-muted d-flex justify-content-between px-4">
            <div>
              <b>{list.nbHits}</b> találat
            </div>
            <div>
              {Search.renderAlgoliaLogo()}
            </div>
          </div>

          {list.hits.map(this.renderResultItem(term))}
        </div>
      )
    }

    private renderResultItem = term => exercise => (
      <NavLink
        key={exercise.objectID}
        to={`/exercise/${exercise.objectID}`}
        className="list-group-item list-group-item-action d-flex flex-column align-items-start"
      >
        <div className="mb-1 d-flex w-100 ">
          <Markdown source={exercise.description} mark={term} />
        </div>
        <div>
          {this.renderBadge(exercise, 'grade', 'light')}
          {this.renderBadge(exercise, 'subject', 'primary')}
          {this.renderBadge(exercise, 'topic', 'info')}
          {this.renderBadge(exercise, 'tags', 'secondary')}
        </div>
      </NavLink>
    )

    private renderBadge(exercise, key, type) {
      return (exercise[key] || []).map(this.renderBadgeItem(type))
    }

    private renderBadgeItem = type => item => {
      return (
        <span className={`badge badge-${type} mx-1`} key={item}>
          {item}
        </span>
      )
    }

    private renderError() {
      const { error } = this.state
      return <div className="alert alert-danger col-md-8 mx-auto">{error.message}</div>
    }

    private static renderInfo() {
      return (
        <div className="text-info col-md-8 mx-auto text-center">
          Írj be legalább 2 karaktert a keresés megkezdéséhez.
        </div>
      )
    }

    private static renderEmpty() {
      return <div className="alert alert-warning col-md-8 mx-auto">Nincs találat</div>
    }

    private static renderAlgoliaLogo() {
      return <img
        className="algolia-logo"
        src="https://www.algolia.com/static_assets/images/press/downloads/algolia-logo-light.svg"
        alt="Search by algolia"
      />
    }
  }
)
