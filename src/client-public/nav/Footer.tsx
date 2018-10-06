import * as React from 'react'
import { Link } from 'client-common/component/general/Link'
import { openFeedbackModal } from 'client-common/store/actions/modal'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { ExternalLink } from '../../client-common/component/general/ExternalLink'

interface FooterDispatchProps {
  openFeedbackModal: typeof openFeedbackModal
}

export const Footer = connect<{}, FooterDispatchProps, {}>(
  undefined,
  { openFeedbackModal }
)(
  class FooterComp extends React.PureComponent<FooterDispatchProps> {
    render() {
      return (
        <footer className="footer">
          <p>
            &copy; Zsebtanár Nonprofit Alapítvány {new Date().getFullYear()}
            {' - '}
            <NavLink to="/about">Rólunk</NavLink>
            {' - '}
            <NavLink to="/join">Csatlakozz!</NavLink>
            {' - '}
            <ExternalLink href={__CONFIG__.links.policy}>Adatvédelem</ExternalLink>
            {' - '}
            <Link onAction={this.props.openFeedbackModal}>Visszajelzés</Link>
            {' - '}
            <NavLink to="/support">Hibaelhárítás</NavLink>
          </p>
        </footer>
      )
    }
  }
)
