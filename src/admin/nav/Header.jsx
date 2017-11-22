import React from 'react'
import { NavLink, withRouter } from 'react-router-dom'

import { connect } from 'react-redux'
import { signOut } from '../../shared/store/actions/auth'
import { openFileManager } from 'shared/store/actions/modal'
import { openSideNav } from 'shared/store/reducers/sideNav'
import { Dropdown, DropdownMenu, DropdownToggle } from 'shared/ui/Dropdown'
import { isAdmin } from 'shared/services/user'
import Button from 'shared/component/general/Button'

const mapStateToProps = state => ({
  session: state.app.session,
  sideNav: state.app.sideNav
})

export default withRouter(
  connect(mapStateToProps, { signOut, openFileManager, openSideNav })(function Header(props) {
    const openFileManager = e => {
      e.preventDefault()
      props.openFileManager()
    }

    if (!props.session.signedIn) return <div />

    return (
      <div className="header clearfix">
        <div className="desktop-header">
          <nav>
            <ul className="nav nav-pills float-right">
              <li className="nav-item">
                <a className="nav-link" href="/">
                  Publikus
                </a>
              </li>
              {isAdmin(props.session.token) && (
                <Dropdown elementType="li">
                  <DropdownToggle>Rendszer</DropdownToggle>
                  <DropdownMenu>
                    <NavLink activeClassName="active" className="dropdown-item" to="/user">
                      <i className="fa fa-users" /> Felhasználók
                    </NavLink>
                    <NavLink activeClassName="active" className="dropdown-item" to="/feedback">
                      <i className="fa fa-commenting-o" /> Visszajelzések
                    </NavLink>
                  </DropdownMenu>
                </Dropdown>
              )}

              <Dropdown elementType="li">
                <DropdownToggle>Tartalom</DropdownToggle>
                <DropdownMenu>
                  <NavLink activeClassName="active" className="dropdown-item" to="/exercise">
                    <i className="fa fa-tasks" /> Feladatok
                  </NavLink>
                  <NavLink activeClassName="active" className="dropdown-item" to="/classification">
                    <i className="fa fa-folder" /> Kategóriák
                  </NavLink>
                </DropdownMenu>
              </Dropdown>

              <Dropdown elementType="li" right className="user-menu">
                <DropdownToggle>
                  <span className="fa-stack fa">
                    <i className="fa fa-circle fa-stack-2x" />
                    <i className="fa fa-user fa-stack-1x fa-inverse" />
                  </span>
                </DropdownToggle>
                <DropdownMenu>
                  <a href="#" className="dropdown-item" onClick={props.signOut}>
                    <i className="fa fa-power-off" /> Kijelentkezés
                  </a>
                </DropdownMenu>
              </Dropdown>
            </ul>
          </nav>
          <NavLink exact to="/" className="logo-link">
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
