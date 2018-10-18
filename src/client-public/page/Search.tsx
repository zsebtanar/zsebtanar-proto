import * as React from 'react'
import * as ReactGA from 'react-ga'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Markdown } from 'client-common/component/general/Markdown'
import { Loading } from 'client-common/component/general/Loading'
import { Icon } from 'client-common/component/general/Icon'
import { search } from 'client-common/services/search'
import { getQueryParams } from 'client-common/util/url'
import { setupPage } from 'client-common/component/hoc/setupPage'
import { pipe } from 'ramda'

const mapStateToProps = state => ({
  session: state.app.session
})

export const Search = pipe(
  setupPage({ storePosition: false }),
  connect(
    mapStateToProps,
    {}
  )
)(
  class Search extends React.Component<any, any> {
    state = { list: undefined, error: undefined, loading: false, term: '' }

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
        ReactGA.event({ category: 'User', action: 'Search', value: term })
        search(term)
          .then(list => this.setState({ list, error: undefined, loading: false, term }))
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

          {this.state.loading && <Loading />}
          {this.renderResult()}
          {this.renderEmpty()}
          {this.renderInfo()}
          {this.renderError()}
        </div>
      )
    }

    renderResult() {
      const { list, loading, error, term } = this.state
      return (
        list &&
        list.nbHits > 0 &&
        !loading &&
        !error && (
          <div className="list-group col-md-10 mx-auto">
            <div className="mb-4 text-muted d-flex justify-content-between px-4">
              <div>
                <b>{list.nbHits}</b> találat
              </div>
              <div>
                <img
                  className="algolia-logo"
                  src="https://www.algolia.com/static_assets/images/press/downloads/algolia-logo-light.svg"
                  alt="Search by algolia"
                />
              </div>
            </div>

            {list.hits.map(ex => (
              <NavLink
                key={ex.objectID}
                to={`/exercise/${ex.objectID}`}
                className="list-group-item list-group-item-action d-flex flex-column align-items-start"
              >
                <div className="mb-1 d-flex w-100 ">
                  <Markdown source={ex.description} mark={term} />
                </div>
                <div>
                  {this.renderBadge(ex, 'grade', 'light')}
                  {this.renderBadge(ex, 'subject', 'primary')}
                  {this.renderBadge(ex, 'topic', 'info')}
                  {this.renderBadge(ex, 'tags', 'secondary')}
                </div>
              </NavLink>
            ))}
          </div>
        )
      )
    }

    renderBadge(exercise, key, type) {
      return (
        exercise[key] &&
        exercise[key].map(item => (
          <span className={`badge badge-${type} mx-1`} key={item}>
            {item}
          </span>
        ))
      )
    }

    renderInfo() {
      const { list, loading } = this.state
      return (
        !list &&
        !loading && (
          <div className="text-info col-md-8 mx-auto text-center">
            Írj be legalább 2 karaktert a keresés megkezdéséhez.
          </div>
        )
      )
    }

    renderError() {
      const { error, loading } = this.state
      return (
        error &&
        !loading && <div className="alert alert-danger col-md-8 mx-auto">{error.message}</div>
      )
    }

    renderEmpty() {
      const { loading, error, list } = this.state

      return (
        list &&
        list.nbHits === 0 &&
        !loading &&
        !error && <div className="alert alert-warning col-md-8 mx-auto">Nincs találat</div>
      )
    }
  }
)
