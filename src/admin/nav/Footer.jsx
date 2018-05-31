import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Link } from 'shared/component/general/Link'
import { openFeedbackModal } from 'shared/store/actions/modal'

export const Footer = connect(undefined, { openFeedbackModal })(function FooterComp(props) {
  return (
    <footer className="footer">
      <p>
        &copy; Zsebtanár Nonprofit Alapítvány {new Date().getFullYear()}
        {' - '}
        <Link onAction={props.openFeedbackModal}>Visszajelzés</Link>
        {' - '}
        <NavLink to="/about">Rólunk</NavLink>
      </p>
    </footer>
  )
})
