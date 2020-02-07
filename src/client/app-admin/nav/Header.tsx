import React from 'react'
import { useUser, useUserDispatch } from 'client/user/providers/UserProvider'
import { NavLink } from 'react-router-dom'
import {
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  Icon,
  DropdownDivider
} from 'client/generic/components'
import { isAdmin } from 'client/user/services/user'

import 'client/app-admin/nav/Header.scss'

///

interface Props {
  onOpenSideNav: () => void
}

export function Header({ onOpenSideNav }: Props) {
  const { loggedIn, userToken } = useUser()
  const { signOut } = useUserDispatch()

  if (!loggedIn || !isAdmin(userToken)) {
    return null
  }

  return (
    <header className="header clearfix">
      <div className="desktop-header">
        <nav>
          <ul className="nav nav-pills float-right">
            <li className="nav-item">
              <a className="nav-link" href="/">
                Publikus
              </a>
            </li>
            {isAdmin(userToken) && (
              <Dropdown elementType="li">
                <DropdownToggle>Rendszer</DropdownToggle>
                <DropdownMenu>
                  <NavLink activeClassName="active" className="dropdown-item" to="/user">
                    <Icon fa="users" /> Felhasználók
                  </NavLink>
                  <NavLink activeClassName="active" className="dropdown-item" to="/feedback">
                    <Icon fa="commenting-o" /> Visszajelzések
                  </NavLink>
                  <NavLink activeClassName="active" className="dropdown-item" to="/utilities">
                    <Icon fa="exclamation-triangle" /> Gépház
                  </NavLink>
                </DropdownMenu>
              </Dropdown>
            )}

            <Dropdown elementType="li">
              <DropdownToggle>Tartalom</DropdownToggle>
              <DropdownMenu>
                <NavLink activeClassName="active" className="dropdown-item" to="/exercise">
                  <Icon fa="tasks" /> Feladatok
                </NavLink>
                <NavLink activeClassName="active" className="dropdown-item" to="/exercise-sheet">
                  <Icon fa="list-alt" /> Feladatsorok
                </NavLink>
                <NavLink activeClassName="active" className="dropdown-item" to="/categories">
                  <Icon fa="folder" /> Kategóriák
                </NavLink>
                <DropdownDivider />
                <NavLink activeClassName="active" className="dropdown-item" to="/wiki-page">
                  <Icon fa="wikipedia-w" /> Wiki oldalak
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
                <a href="#" className="dropdown-item" onClick={signOut}>
                  <Icon fa="power-off" /> Kijelentkezés
                </a>
              </DropdownMenu>
            </Dropdown>
          </ul>
        </nav>
        <NavLink exact to="/" className="logo-link" aria-label="Főoldal">
          <div className="text-muted logo" />
        </NavLink>
      </div>

      <div className="mobile-header ">
        <Button
          className="navbar-toggle float-left"
          onAction={onOpenSideNav}
          title="Menü megnyitása"
        >
          <span className="fa fa-bars fa-lg" />
        </Button>

        <NavLink exact to="/" className="logo-link float-right" aria-label="Főoldal">
          <div className="text-muted logo" />
        </NavLink>
      </div>
    </header>
  )
}
