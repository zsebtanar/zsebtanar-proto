import React from 'react'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import MainClassificationSelector from 'public/component/MainClassificationSelector'
import DonateButton from 'public/component/DonateButton'
import Button from 'shared/component/general/Button'
import { openSignInModal, openSignUpModal } from 'shared/store/actions/modal'
import Icon from 'shared/component/general/Icon'
import debounce from 'shared/util/debounce'
import { compose } from 'ramda'

const mapStateToProps = state => ({
  session: state.app.session
})

export default compose(withRouter,

  connect(mapStateToProps, { openSignInModal, openSignUpModal }))(
  class Home extends React.Component {
    searchInput = null

    searchInputChange = debounce(() => {
      this.props.history.push({ pathname: '/search', search: `?q=${this.searchInput.value}` })
    }, 800)

    render() {
      return (
        <div>
          <div className="jumbotron mb-5">
            {this.renderWelcome()}
            <div className="my-5 col-11 mx-auto">
              <NavLink to="/search">
                <div className="search-input-group ">
                  <label className="search-label" htmlFor="search-input">
                    <Icon fa="search" size="lg" />
                    <span className="sr-only">Feladat keresés</span>
                  </label>
                  <input
                    id="search-input"
                    type="text"
                    className="form-control"
                    placeholder="Feladat keresés ..."
                    autoFocus
                    ref={inp => (this.searchInput = inp)}
                    onChange={this.searchInputChange}
                  />
                </div>
              </NavLink>
            </div>
          </div>

          <MainClassificationSelector />

          <DonateButton />

        </div>
      )
    }

    renderWelcome() {
      const { session, openSignUpModal, openSignInModal } = this.props

      if (session.signedIn) {
        return (
          <h1 className="text-center">
            Szia {session.user.displayName || session.user.email}
          </h1>
        )
      } else {
        return (
          <div className="text-center">
            <h1 className="main-logo"></h1>
            <h1>
              <strong>
                Zsebtanár
              </strong>
            </h1>
            <h5>
              Tanulás lépésről lépésre
            </h5>
          </div>
        )
      }
    }
  }
)
