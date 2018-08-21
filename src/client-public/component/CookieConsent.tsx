import * as React from 'react'
import { connect } from 'react-redux'
import { Button } from '../../client-common/component/general/Button'
import { openCookieModal } from '../../client-common/store/actions/modal'
import { ExternalLink } from '../../client-common/component/general/ExternalLink'

interface CookieConsentDispatchProps {
  openCookieModal: typeof openCookieModal
}

interface CookieConsentState {
  active: boolean
}

const CONSENT_KEY = 'zsebtanar-consent-accepted'

export const CookieConsent = connect<{}, CookieConsentDispatchProps, {}>(
  undefined,
  { openCookieModal }
)(
  class CookieConsentComponent extends React.Component<
    CookieConsentDispatchProps,
    CookieConsentState
  > {
    state = {
      active: window.localStorage.getItem(CONSENT_KEY) !== 'true'
    }

    private accept = () => {
      window.localStorage.setItem(CONSENT_KEY, 'true')
      this.setState({active: false})
    }

    render() {
      if (this.state.active) {
        return (
          <div className="cookie-consent p-2">
            <div>
              <ExternalLink href={__CONFIG__.links.policy}>
                Adatvédelmi tájékoztatónkban
              </ExternalLink>{' '}
              megtalálod, hogyan gondoskodunk adataid védelméről. Oldalunkon HTTP-sütiket használunk
              a jobb működésért.
              <Button className="btn btn-link" onAction={this.props.openCookieModal}>
                További információk
              </Button>
            </div>
            <Button className="btn btn-warning mx-2" onAction={this.accept}>
              Rendben
            </Button>
          </div>
        )
      } else {
        return <div />
      }
    }
  }
)
