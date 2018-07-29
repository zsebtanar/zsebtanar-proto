import { Button } from 'client-common/component/general/Button'
import { Dropdown } from 'client-common/component/general/dropdown/Dropdown'
import { Link } from 'client-common/component/general/Link'
import { isAdmin } from 'client-common/services/user'
import { signOut } from 'client-common/store/actions/auth'
import { openSignInModal, openSignUpModal } from 'client-common/store/actions/modal'
import { openSideNav } from 'client-common/store/reducers/sideNav'
import * as React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { DropdownMenu } from 'client-common/component/general/dropdown/DropdownMenu'
import { DropdownToggle } from 'client-common/component/general/dropdown/DropdownToggle'

interface HeaderStateProps {
  session: state.Session
  sideNav: state.SideNav
}

interface HeaderDispatchProps {
  signOut: typeof signOut
  openSideNav: typeof openSideNav
  openSignInModal: typeof openSignInModal
  openSignUpModal: typeof openSignUpModal
}

const mapStateToProps = state => ({
  session: state.app.session,
  sideNav: state.app.sideNav
})

export const Header = connect<HeaderStateProps, HeaderDispatchProps, {}>(
  mapStateToProps,
  {
    signOut,
    openSideNav,
    openSignInModal,
    openSignUpModal
  }
)(function HeaderComp(props: HeaderStateProps & HeaderDispatchProps) {
  const { signedIn, token } = props.session
  return (
    <div className="header clearfix">
      <div className="desktop-header">
        <nav>
          <ul className="nav nav-pills float-right">
            {signedIn && isAdmin(token) ? (
              <li className="nav-item" key="admin">
                <a href="/admin/exercise" className="nav-link">
                  Admin
                </a>
              </li>
            ) : (
              ''
            )}
            {signedIn
              ? [
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
              : [
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
                ]}
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
