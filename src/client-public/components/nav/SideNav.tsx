import React from 'react'
import * as cx from 'classnames'
import { CloseButton } from 'client-common/components/generic'
import { useUser, useUserDispatch } from 'client-common/providers/UserProvider'
import { isAdmin } from 'client-common/services/user'
import { NavLink } from 'react-router-dom'

import 'client-public/components/nav/SideNav.scss'

interface Props {
  isOpen: boolean
  onCloseSideNav: () => void
}

export function SideNav({ isOpen, onCloseSideNav }: Props) {
  const { loggedIn, userToken } = useUser()

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
    <nav
      className={cx('sidebar', { active: isOpen })}
      aria-hidden={!isOpen}
      onClick={onCloseSideNav}
    >
      <div className="sidebar-content clearfix flex-column d-flex">
        <div className="m-2 d-flex justify-content-between align-items-center">
          <h4 className="my-0">
            <NavLink exact to="/">
              <span className="text-muted">Zsebtanár</span>
            </NavLink>
          </h4>
          <CloseButton onClick={onCloseSideNav} aria-label="Menü bezárása" />
        </div>
        <nav className="mobile-nav">
          <ul className="nav nav-pills flex-column">
            {loggedIn && isAdmin(userToken) && <AdminMenu />}
            {loggedIn ? <SignedInMenu /> : <AnonymousUserMenu />}
          </ul>
        </nav>
      </div>
    </nav>
  )
}

function SignedInMenu() {
  const { signOut } = useUserDispatch()
  return (
    <li className="nav-item" key="sing-out">
      <button className="nav-link" onClick={signOut}>
        Kijelentkezés
      </button>
    </li>
  )
}

function AnonymousUserMenu() {
  return (
    <>
      <li className="nav-item" key="sign-up">
        <NavLink activeClassName="active" className="nav-link" to="/register">
          <i className="fa fa-plus" /> Regisztráció
        </NavLink>
      </li>
      <li className="nav-item" key="sign-in">
        <NavLink activeClassName="active" className="nav-link" to="/login">
          <i className="fa fa-sign-in" /> Belépés
        </NavLink>
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
