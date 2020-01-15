import React from 'react'
import { useUser, useUserDispatch } from 'client-common/providers/UserProvider'
import { NavLink } from 'react-router-dom'
import {
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  Link,
  Icon
} from 'client-common/components/generic'
import { isAdmin } from 'client-common/services/user'

import 'client-public/components/nav/Header.scss'

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
            <span className="fa fa-bars fa-lg" />
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
        <span className="fa-stack fa">
          <i className="fa fa-circle fa-stack-2x" />
          <i className="fa fa-user fa-stack-1x fa-inverse" />
        </span>
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
  return (
    <>
      <li className="nav-item" key="sign-up">
        <Link className="nav-link" href="/register">
          <Icon fa="plus" /> Regisztráció
        </Link>
      </li>
      <li className="nav-item" key="sign-in">
        <Link className="nav-link" href="/login">
          <Icon fa="sign-in" /> Belépés
        </Link>
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
