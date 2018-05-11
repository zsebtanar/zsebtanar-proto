import React from 'react'
import Link from 'shared/component/general/Link'
import { openFeedbackModal } from 'shared/store/actions/modal'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'

export const Footer =  connect(undefined, { openFeedbackModal })(function Footer(props) {
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
