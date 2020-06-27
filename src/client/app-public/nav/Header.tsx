import React from 'react'
import { useUser, useUserDispatch } from 'client/user/providers/UserProvider'
import { NavLink } from 'react-router-dom'
import { Button, Dropdown, DropdownToggle, DropdownMenu, Link } from 'client/generic/components'
import { isAdmin } from 'client/user/services/user'

import 'client/app-public/nav/Header.scss'
import { useOverlayDispatch } from 'client/overlay/providers'
import { SignInModal } from 'client/user/modals/SignInModal'
import { faPlus, faSignInAlt, faBars, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

///

interface Props {
  onOpenSideNav: () => void
}

export function Header({ onOpenSideNav }: Props) {
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
      <DropdownToggle>
        <FontAwesomeIcon icon={faUser} />
      </DropdownToggle>
      <DropdownMenu>
        <NavLink exact to="/profile" className="dropdown-item">
          Profile
        </NavLink>
        <button className="dropdown-item" onClick={user.signOut}>
          Kijelentkezés
        </button>
      </DropdownMenu>
    </Dropdown>
  )
}

function AnonymousUserMenu() {
  const { openModal } = useOverlayDispatch()

  return (
    <>
      <li className="nav-item" key="sign-up">
        <Link className="nav-link" href="/register" data-testid="header-reg-btn">
          <FontAwesomeIcon icon={faPlus} /> Regisztráció
        </Link>
      </li>
      <li className="nav-item" key="sign-in">
        <Button onAction={() => openModal(<SignInModal />)} btn="link">
          <FontAwesomeIcon icon={faSignInAlt} /> Belépés
        </Button>
      </li>
    </>
  )
}

function AdminMenu() {
  return (
    <li className="nav-item" key="admin">
      <a href={'/admin/exercise'} className="nav-link">
        Admin
      </a>
    </li>
  )
}
