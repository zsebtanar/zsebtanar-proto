import React from 'react'
import { NavLink, withRouter } from 'react-router-dom'

import { connect } from 'react-redux'
import { signOut } from '../../shared/store/actions/auth'
import { openFileManager } from 'shared/store/actions/modal'

const mapStateToProps = (state) => ({
  session: state.app.session
})

export default withRouter(connect(mapStateToProps, {signOut, openFileManager})(function Header (props) {
  const signOut = () =>
    props.signOut()
      .then(() => props.history.push('/'))

  const openFileManager = (e) => {
    e.preventDefault()
    props.openFileManager()
  }

  if (!props.session.signedIn) return <div/>

  return (
    <div className="header clearfix">
      <nav>
        <ul className="nav nav-pills float-right">

          <li className="nav-item">
            <a className="nav-link" href="/">Publikus</a>
          </li>

          <li className="nav-item">
            <NavLink activeClassName="active" className="nav-link" to="/user">Felhasználók</NavLink>
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
            <a href="#" className="nav-link" onClick={signOut} title="Kijelentkezés"><i
              className="fa fa-power-off"/></a>
          </li>
        </ul>
      </nav>
      <NavLink exact to="/">
        <h4 className="text-muted logo">Tanári</h4>
      </NavLink>
    </div>
  )
}))
