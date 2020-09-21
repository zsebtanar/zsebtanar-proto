import React from 'react'
import { useUser, useUserDispatch } from 'client/user/providers/UserProvider'
import { NavLink } from 'react-router-dom'
import { isAdmin } from 'client/user/services/user'
import { faPlus, faBars, faUser, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'client/generic/components/Link'
import { Button } from 'client/generic/components/Button'
import { Dropdown } from 'client/generic/components/dropdown/Dropdown'
import { DropdownToggle } from 'client/generic/components/dropdown/DropdownToggle'
import { DropdownMenu } from 'client/generic/components/dropdown/DropdownMenu'

import './Header.scss'

///

interface Props {
  onOpenSideNav: () => void
}

export function Header({ onOpenSideNav }: Props): JSX.Element {
  const { loggedIn, userToken } = useUser()

  return (
    <header className="header clearfix">
      <div className="container">
        <div className="desktop-header">
          <NavLink exact to="/">
            <div className="logo" />
          </NavLink>
          <nav>
            <ul className="nav nav-pills">
              <li className="nav-item" key="search">
                <NavLink
                  className="btn btn-outline-primary mx-2"
                  to="/search"
                  data-testid="header-reg-btn"
                  activeClassName="d-none"
                >
                  <FontAwesomeIcon icon={faSearch} /> Feladat kereső
                </NavLink>
              </li>
              {loggedIn && isAdmin(userToken) && <AdminMenu />}
              {loggedIn ? <SignedInMenu /> : <AnonymousUserMenu />}
            </ul>
          </nav>
        </div>

        <div className="mobile-header">
          <NavLink exact to="/" className="logo-link" aria-label="Főoldal">
            <div className="logo" />
          </NavLink>

          <Button className="navbar-toggle" onAction={onOpenSideNav} title="Menü megnyitása">
            <FontAwesomeIcon icon={faBars} size="lg" />
          </Button>
        </div>
      </div>
    </header>
  )
}

function SignedInMenu() {
  const user = useUserDispatch()

  return (
    <Dropdown elementType="li" className="user-menu" right key="user-menu">
      <DropdownToggle aria-label="Felhasználói menü" className="nav-link btn btn-link">
        <FontAwesomeIcon icon={faUser} />
      </DropdownToggle>
      <DropdownMenu>
        <NavLink exact to="/profile" className="dropdown-item">
          Profile
        </NavLink>
        <button className="dropdown-item" onClick={user.signOut} data-testid="header-signout-btn">
          Kijelentkezés
        </button>
      </DropdownMenu>
    </Dropdown>
  )
}

function AnonymousUserMenu() {
  return (
    <>
      <li className="nav-item" key="sign-up">
        <Link className="btn btn-outline-primary mx-2" to="/register" data-testid="header-reg-btn">
          <FontAwesomeIcon icon={faPlus} /> Regisztráció
        </Link>
      </li>
      <li className="nav-item" key="sign-in">
        <Link className="btn btn-primary" to="/login" data-testid="header-login-btn">
          <FontAwesomeIcon icon={faUser} /> Belépés
        </Link>
      </li>
    </>
  )
}

function AdminMenu() {
  return (
    <li className="nav-item" key="admin">
      <a href={'/admin/exercise'} className="btn btn-outline-secondary mx-2">
        Admin
      </a>
    </li>
  )
}
