import React from 'react'
import {NavLink, withRouter} from 'react-router-dom'

import {connect} from 'react-redux'
import {signOut} from '../../store/actions/auth'

const mapStateToProps = (state) => ({
  session: state.session
})

export default withRouter(connect(mapStateToProps, {signOut})(function Header(props) {
  const signOut = () =>
    props.signOut()
      .then(() => props.history.push('/'))

  return (
    <div className="header clearfix">
      <nav>
        <ul className="nav nav-pills float-right">
          <li className="nav-item">
            <NavLink activeClassName="active" className="nav-link" exact to="/">Home</NavLink>
          </li>
          {
            props.session.signedIn
            ? <li className="nav-item">
                <NavLink activeClassName="active" className="nav-link" to="/exercise">Exercises</NavLink>
              </li>
            : null
          }
          {
            props.session.signedIn
              ?
                <li className="nav-item" key="sing-out">
                  <a href="#" className="nav-link" onClick={signOut}>Sing-out</a>
                </li>
              :
              [
                <li className="nav-item" key="sign-up">
                  <NavLink activeClassName="active" className="nav-link" to="/sign-up">
                    <i className="fa fa-plus"/> Sign up
                  </NavLink>
                </li>,
                <li className="nav-item" key="sign-in">
                  <NavLink activeClassName="active" className="nav-link" to="/sign-in">
                    <i className="fa fa-sign-in"/> Sign in
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