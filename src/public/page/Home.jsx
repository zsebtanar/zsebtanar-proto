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
        return <h1 className="display-4">Szia {session.user.displayName || session.user.email}</h1>
      } else {
        return (
          <div className="text-center">
            <Button className="btn btn-lg btn-outline-primary my-1" onAction={openSignUpModal}>
              Regisztrálj
            </Button>&nbsp;
            <Button className="btn btn-link" onAction={openSignInModal}>
              Jelentkezz be
            </Button>
            <p className="text-muted my-3"><span className="or-label">vagy</span></p>
            <p>Vesd bele magad a feladatokba</p>
          </div>
        )
      }
    }
  }
)
