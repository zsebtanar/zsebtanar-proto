import * as React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Link } from 'client-common/component/general/Link'
import { openFeedbackModal } from 'client-common/store/actions/modal'

interface FooterDispatchProps {
  openFeedbackModal: typeof openFeedbackModal
}

export const Footer = connect<any, FooterDispatchProps>(
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
            <Link onAction={this.props.openFeedbackModal}>Visszajelzés</Link>
            {' - '}
            <NavLink to="/about">Rólunk</NavLink>
          </p>
        </footer>
      )
    }
  }
)
