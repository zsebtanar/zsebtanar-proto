import React from 'react'
import { NavLink, withRouter } from 'react-router-dom'

import { connect } from 'react-redux'
import { signOut } from '../../shared/store/actions/auth'
import { openFileManager } from 'shared/store/actions/modal'
import Button from 'shared/component/general/Button'
import { openSideNav } from 'shared/store/reducers/sideNav'

const mapStateToProps = (state) => ({
  session: state.app.session,
  sideNav: state.app.sideNav
})

export default withRouter(connect(mapStateToProps, {signOut, openFileManager, openSideNav})(function Header (props) {
  const openFileManager = (e) => {
    e.preventDefault()
    props.openFileManager()
  }

  if (!props.session.signedIn) return <div/>

  return (
    <div className="header clearfix">
      <div className="desktop-header">
        <nav>
          <ul className="nav nav-pills float-right">

            <li className="nav-item">
              <a className="nav-link" href="/">Publikus</a>
            </li>

            <li className="nav-item">
              <NavLink activeClassName="active" className="nav-link" to="/user">Felhasználók</NavLink>
            </li>

            <li className="nav-item">
              <NavLink activeClassName="active" className="nav-link" to="/feedback">Visszajelzések</NavLink>
            </li>

            <li className="nav-item">
              <NavLink activeClassName="active" className="nav-link" to="/classification">Kategóriák</NavLink>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#" onClick={openFileManager}>Képek</a>
            </li>

            <li className="nav-item">
              <NavLink activeClassName="active" className="nav-link" to="/exercise">Feladatok</NavLink>
            </li>

            <li className="nav-item" key="sing-out">
              <a href="#" className="nav-link" onClick={props.signOut} title="Kijelentkezés"><i
                className="fa fa-power-off"/></a>
            </li>
          </ul>
        </nav>
        <NavLink exact to="/" className="logo-link">
          <h4 className="text-muted logo"/>
        </NavLink>
      </div>

      <div className="mobile-header ">
        <Button
          className="navbar-toggler float-left"
          onAction={props.openSideNav}
          aria-expanded={props.sideNav.active}
          aria-label="Menü megnyitása">
          <span className="fa fa-bars fa-lg"/>
        </Button>

        <NavLink exact to="/" className="logo-link float-right">
          <h4 className="text-muted logo"/>
        </NavLink>
      </div>
    </div>
  )
}))
