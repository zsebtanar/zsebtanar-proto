import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Markdown } from 'shared/component/general/Markdown'
import Loading from 'shared/component/general/Loading'
import Icon from 'shared/component/general/Icon'
import { parseQueryParams } from 'shared/util/url'
import { search } from 'shared/services/search'

const mapStateToProps = state => ({
  session: state.app.session
})

export default connect(mapStateToProps, {})(
  class Search extends React.Component {
    state = { list: undefined, error: undefined, loading: false, term: '' }

    componentDidMount(){
      const searchTerm = parseQueryParams(this.props.history.location.search, 'q')
      if (searchTerm) {
        this.searchInput.value = searchTerm
        this.searchTerm(searchTerm)
      }
    }

    onSearch = (event) => this.searchTerm(event.currentTarget.value)

    searchTerm = term => {
      if (term.length >= 2) {
        this.setState({ loading: true, list: undefined })
        this.props.history.push({search: `q=${term}`})
        search(term)
          .then(list => this.setState({ list, error: undefined, loading: false, term }))
          .catch(error => this.setState({ error, loading: false }))
      } else {
        this.props.history.push({search: ``})
        this.setState({ loading: false, list: undefined, term: '' })
      }
    }

    getInputRef = (ref) => this.searchInput = ref

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
