import React from 'react'
import { useUser, useUserDispatch } from 'client/user/providers/UserProvider'
import { NavLink } from 'react-router-dom'
import {
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownDivider
} from 'client/generic/components'
import { isAdmin } from 'client/user/services/user'

import 'client/app-admin/nav/Header.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUsers,
  faComment,
  faExclamationTriangle,
  faTasks,
  faListAlt,
  faFolder,
  faPowerOff,
  faBars
} from '@fortawesome/free-solid-svg-icons'
import { faWikipediaW } from '@fortawesome/free-brands-svg-icons'

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
        <NavLink exact to="/" className="logo-link" aria-label="Főoldal">
          <div className="text-muted logo" />
        </NavLink>
        <nav>
          <ul className="nav nav-pills">
            <li className="nav-item">
              <a className="btn btn-secondary mr-2" href="/">
                Publikus oldal
              </a>
            </li>
            {isAdmin(userToken) && (
              <Dropdown elementType="li">
                <DropdownToggle>Rendszer</DropdownToggle>
                <DropdownMenu>
                  <NavLink activeClassName="active" className="dropdown-item" to="/user">
                    <FontAwesomeIcon icon={faUsers} /> Felhasználók
                  </NavLink>
                  <NavLink activeClassName="active" className="dropdown-item" to="/feedback">
                    <FontAwesomeIcon icon={faComment} /> Visszajelzések
                  </NavLink>
                  <NavLink activeClassName="active" className="dropdown-item" to="/utilities">
                    <FontAwesomeIcon icon={faExclamationTriangle} /> Gépház
                  </NavLink>
                </DropdownMenu>
              </Dropdown>
            )}

            <Dropdown elementType="li">
              <DropdownToggle>Tartalom</DropdownToggle>
              <DropdownMenu>
                <NavLink activeClassName="active" className="dropdown-item" to="/exercise">
                  <FontAwesomeIcon icon={faTasks} /> Feladatok
                </NavLink>
                <NavLink activeClassName="active" className="dropdown-item" to="/exercise-sheet">
                  <FontAwesomeIcon icon={faListAlt} /> Feladatsorok
                </NavLink>
                <NavLink activeClassName="active" className="dropdown-item" to="/categories">
                  <FontAwesomeIcon icon={faFolder} /> Kategóriák
                </NavLink>
                <DropdownDivider />
                <NavLink activeClassName="active" className="dropdown-item" to="/wiki-page">
                  <FontAwesomeIcon icon={faWikipediaW} /> Wiki oldalak
                </NavLink>
              </DropdownMenu>
            </Dropdown>

            <Dropdown elementType="li" right>
              <DropdownToggle>Profil</DropdownToggle>
              <DropdownMenu>
                <button className="dropdown-item btn btn-link " onClick={signOut}>
                  <FontAwesomeIcon icon={faPowerOff} /> Kijelentkezés
                </button>
              </DropdownMenu>
            </Dropdown>
          </ul>
        </nav>
      </div>

      <div className="mobile-header ">
        <Button
          className="navbar-toggle float-left"
          onAction={onOpenSideNav}
          title="Menü megnyitása"
        >
          <FontAwesomeIcon icon={faBars} size="lg" />
        </Button>

        <NavLink exact to="/" className="logo-link float-right" aria-label="Főoldal">
          <div className="text-muted logo" />
        </NavLink>
      </div>
    </header>
  )
}
