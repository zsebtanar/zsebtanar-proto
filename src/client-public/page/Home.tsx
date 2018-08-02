import { pipe } from 'ramda'
import * as React from 'react'
import CookieConsent from 'react-cookie-consent'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import { Button } from 'client-common/component/general/Button'
import { Icon } from 'client-common/component/general/Icon'
import {
  openCookieModal,
  openSignInModal,
  openSignUpModal
} from 'client-common/store/actions/modal'
import debounce from 'client-common/util/debounce'
import { DonateButton } from '../component/DonateButton'
import { MainClassificationSelector } from '../component/MainClassificationSelector'
import { RouteComponentProps } from 'react-router'

interface HomeStateProps {
  session: state.Session
}

interface HomeDispatchProps {
  openSignInModal: typeof openSignInModal
  openSignUpModal: typeof openSignUpModal
  openCookieModal: typeof openCookieModal
}

const mapStateToProps = (state: state.Root) => ({
  session: state.app.session
})

const GDPR_PDF_URL = 'https://firebasestorage.googleapis.com/v0/b/zsebtanar-prod.appspot.com' +
  '/o/docs%2Fzsebtanar-adatvedelmi-szabalyzat-2018.pdf?alt=media&amp;token=3cd16e18-51bc-4069-af98-051df97f2fe6'

export const Home = pipe(
  withRouter,
  connect<HomeStateProps, HomeDispatchProps, RouteComponentProps<{}>>(
    mapStateToProps,
    { openSignInModal, openSignUpModal, openCookieModal }
  )
)(
  class HomeComponent extends React.Component<
    HomeStateProps & HomeDispatchProps & RouteComponentProps<{}>,
    {}
  > {
    private searchInput = null

    private searchInputChange = debounce(() => {
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

          <CookieConsent buttonText="Rendben">
            <a
              href={GDPR_PDF_URL}
              target="_blank"
            >
              Adatvédelmi tájékoztatónkban
            </a>{' '}
            megtalálod, hogyan gondoskodunk adataid védelméről. Oldalainkon HTTP-sütiket használunk
            a jobb működésért.
            <Button className="btn btn-link" onAction={this.props.openCookieModal}>
              További információ
            </Button>
          </CookieConsent>
        </div>
      )
    }

    private renderWelcome() {
      const { session } = this.props

      if (session.signedIn) {
        return (
          <h1 className="text-center">Szia {session.user.displayName || session.user.email}</h1>
        )
      } else {
        return (
          <div className="text-center">
            <h1>
              <strong>Zsebtanár</strong>
            </h1>
            <h4>Tanulás lépésről lépésre</h4>
          </div>
        )
      }
    }
  }
)
