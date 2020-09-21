import React from 'react'
import cx from 'classnames'
import { useUser, useUserDispatch } from 'client/user/providers/UserProvider'
import { isAdmin } from 'client/user/services/user'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSignInAlt } from '@fortawesome/free-solid-svg-icons'
import { CloseButton } from 'client/generic/components/CloseButton'

import './SideNav.scss'

interface Props {
  isOpen: boolean
  onCloseSideNav: () => void
}

export function SideNav({ isOpen, onCloseSideNav }: Props): JSX.Element {
  const { loggedIn, userToken } = useUser()

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
    <nav
      className={cx('sidebar', { active: isOpen })}
      aria-hidden={!isOpen}
      onClick={onCloseSideNav}
    >
      <div className="sidebar-content clearfix flex-column d-flex">
        <div className="m-2 text-right">
          <CloseButton onClick={onCloseSideNav} aria-label="Menü bezárása" />
        </div>
        <nav className="mobile-nav list-group list-group-flush flex-column text-center">
          <NavLink exact to="/" className="list-group-item">
            Főoldal
          </NavLink>
          <NavLink className="list-group-item" to="/search" data-testid="header-reg-btn">
            Feladat kereső
          </NavLink>

          {loggedIn && isAdmin(userToken) && <AdminMenu />}
          <div className="vertical-spacer list-group-item" />
          {loggedIn ? <SignedInMenu /> : <AnonymousUserMenu />}
        </nav>
      </div>
    </nav>
  )
}

function SignedInMenu() {
  const { signOut } = useUserDispatch()
  return (
    <button className="list-group-item" onClick={signOut} key="sing-out">
      Kijelentkezés
    </button>
  )
}

function AnonymousUserMenu() {
  return (
    <>
      <NavLink
        key="sign-up"
        activeClassName="active"
        className="list-group-item"
        to="/register"
        data-testid="sidenav-reg-btn"
      >
        <FontAwesomeIcon icon={faPlus} /> Regisztráció
      </NavLink>

      <NavLink
        key="sign-in"
        activeClassName="active"
        className="list-group-item"
        to="/login"
        data-testid="sidenav-reg-btn"
      >
        <FontAwesomeIcon icon={faSignInAlt} /> Belépés
      </NavLink>
    </>
  )
}

function AdminMenu() {
  return (
    <a href={'/admin/exercise'} className="list-group-item" key="admin">
      Admin
    </a>
  )
}
