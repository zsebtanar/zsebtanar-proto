import React from 'react'
import * as cx from 'classnames'
import { CloseButton, Button } from 'client/generic/components'
import { useUser, useUserDispatch } from 'client/user/providers/UserProvider'
import { NavLink } from 'react-router-dom'

import 'client/app-admin/nav/SideNav.scss'
import { isAdmin } from 'client/user/services/user'

interface Props {
  isOpen: boolean
  onCloseSideNav: () => void
}

export function SideNav({ isOpen, onCloseSideNav }: Props) {
  const { loggedIn, userToken } = useUser()
  const { signOut } = useUserDispatch()

  if (!loggedIn || !isAdmin(userToken)) {
    return null
  }

  return (
    <nav
      className={cx('sidebar', { active: isOpen })}
      aria-hidden={!isOpen}
      onClick={onCloseSideNav}
    >
      <div className="sidebar">
        <div className="sidebar-content clearfix flex-column d-flex">
          <div className="m-2 d-flex justify-content-between">
            <h4 className="my-0">
              <NavLink exact to="/">
                <span className="text-danger">Zsebtanár</span>
              </NavLink>
            </h4>
            <CloseButton onClick={onCloseSideNav} aria-label="Menü bezárása" />
          </div>
          <nav className="mobile-nav">
            <ul className="nav nav-pills flex-column">
              <li className="nav-item">
                <NavLink activeClassName="active" className="nav-link" to="/user">
                  Felhasználók
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink activeClassName="active" className="nav-link" to="/feedback">
                  Visszajelzés
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink activeClassName="active" className="nav-link" to="/classification">
                  Kategóriák
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink activeClassName="active" className="nav-link" to="/exercise">
                  Feladatok
                </NavLink>
              </li>
              <li>
                <hr />
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/">
                  Publikus
                </a>
              </li>
              <li className="nav-item" key="sing-out">
                <Button className="nav-link" onAction={signOut} title="Kijelentkezés">
                  Kijelentkezés
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </nav>
  )
}
