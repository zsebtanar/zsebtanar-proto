import React from 'react'
import { NavLink, withRouter } from 'react-router-dom'

import { connect } from 'react-redux'
import { signOut } from '../../store/actions/auth'

const mapStateToProps = (state) => ({
  session: state.app.session
})

export default withRouter(connect(mapStateToProps, {signOut})(function Header (props) {
  const signOut = () =>
    props.signOut()
      .then(() => props.history.push('/'))

  if (!props.session.signedIn) return <div/>

  return (
    <div className="header clearfix">
      <nav>
        <ul className="nav nav-pills float-right">
          <li className="nav-item">
            <NavLink activeClassName="active" className="nav-link" exact to="/">Kezdőlap</NavLink>
          </li>

          <li className="nav-item">
            <NavLink activeClassName="active" className="nav-link" to="/exercise">Feladatok</NavLink>
          </li>

          <li className="nav-item" key="sing-out">
            <a href="#" className="nav-link" onClick={signOut}>Kijelentkezés</a>
          </li>
        </ul>
      </nav>
      <NavLink exact to="/">
        <h4 className="text-muted logo">Tanári</h4>
      </NavLink>
    </div>
  )
}))
