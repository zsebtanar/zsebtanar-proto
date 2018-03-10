import React from 'react'
import { NavLink, withRouter } from 'react-router-dom'

import { connect } from 'react-redux'
import { signOut } from '../../shared/store/actions/auth'
import { isAdmin } from 'shared/services/user'
import Button from 'shared/component/general/Button'
import { openSideNav } from 'shared/store/reducers/sideNav'
import { openSignInModal, openSignUpModal } from 'shared/store/actions/modal'
import Link from 'shared/component/general/Link'
import { Dropdown, DropdownMenu, DropdownToggle } from 'shared/ui/Dropdown'

const mapStateToProps = state => ({
  session: state.app.session,
  sideNav: state.app.sideNav
})

export default withRouter(
  connect(mapStateToProps, {
    signOut,
    openSideNav,
    openSignInModal,
    openSignUpModal
  })(function Header(props) {
    const { signedIn, token } = props.session
    return (
      <div className="header clearfix">
        <div className="desktop-header">
          <nav>
            <ul className="nav nav-pills float-right">
              {signedIn && isAdmin(token) ? (
                <li className="nav-item" key="admin">
                  <a href="/admin/" className="nav-link">
                    Admin
                  </a>
                </li>
              ) : (
                ''
              )}
              {signedIn ? (
                [
                  <Dropdown elementType="li" className="user-menu" right key="user-menu">
                    <DropdownToggle>
                      <span className="fa-stack fa">
                        <i className="fa fa-circle fa-stack-2x" />
                        <i className="fa fa-user fa-stack-1x fa-inverse" />
                      </span>
                    </DropdownToggle>
                    <DropdownMenu>
                      <NavLink exact to="/profile" className="dropdown-item">
                        Profile
                      </NavLink>
                      <a href="#" className="dropdown-item" onClick={props.signOut}>
                        Kijelentkezés
                      </a>
                    </DropdownMenu>
                  </Dropdown>
                ]
              ) : (
                [
                  <li className="nav-item" key="sign-up">
                    <Link className="nav-link" onAction={props.openSignUpModal}>
                      <i className="fa fa-plus" /> Regisztráció
                    </Link>
                  </li>,
                  <li className="nav-item" key="sign-in">
                    <Link className="nav-link" onAction={props.openSignInModal}>
                      <i className="fa fa-sign-in" /> Belépés
                    </Link>
                  </li>
                ]
              )}
            </ul>
          </nav>
          <NavLink exact to="/">
            <h4 className="text-muted logo" />
          </NavLink>
        </div>

        <div className="mobile-header ">
          <Button
            className="navbar-toggler float-left"
            onAction={props.openSideNav}
            aria-expanded={props.sideNav.active}
            aria-label="Menü megnyitása"
          >
            <span className="fa fa-bars fa-lg" />
          </Button>

          <NavLink exact to="/" className="logo-link float-right">
            <h4 className="text-muted logo" />
          </NavLink>
        </div>
      </div>
    )
  })
)
