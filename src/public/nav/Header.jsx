import React from 'react'
import { NavLink, withRouter } from 'react-router-dom'

import { connect } from 'react-redux'
import { signOut } from '../../shared/store/actions/auth'
import { ROLE_USER } from 'shared/services/user'

const mapStateToProps = (state) => ({
  session: state.app.session
})

export default withRouter(connect(mapStateToProps, {signOut})(function Header (props) {
  const signOut = () =>
    props.signOut()
      .then(() => props.history.push('/'))

  return (
    <div className="header clearfix">
      <nav>
        <ul className="nav nav-pills float-right">
          {
            props.session.signedIn && props.session.userDetails.role > ROLE_USER
              ? <li className="nav-item" key="admin">
                <a href="/admin/" className="nav-link">Admin</a>
              </li>
              : ''
          }
          {
            props.session.signedIn
              ? [
                <li className="nav-item" key="sing-out">
                  <a href="#" className="nav-link" onClick={signOut}>Kijelentkezés</a>
                </li>
              ]
              : [
                <li className="nav-item" key="sign-up">
                  <NavLink activeClassName="active" className="nav-link" to="/sign-up">
                    <i className="fa fa-plus"/> Regisztráció
                  </NavLink>
                </li>,
                <li className="nav-item" key="sign-in">
                  <NavLink activeClassName="active" className="nav-link" to="/sign-in">
                    <i className="fa fa-sign-in"/> Belépés
                  </NavLink>
                </li>
              ]
          }
        </ul>
      </nav>
      <NavLink exact to="/">
        <h4 className="text-muted logo"/>
      </NavLink>
    </div>
  )
}))
