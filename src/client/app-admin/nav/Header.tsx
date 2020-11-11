import React from 'react'
import { useUser, useUserDispatch } from 'client/user/providers/UserProvider'
import { NavLink } from 'react-router-dom'
import { isAdmin } from 'client/user/services/user'
import {
  Users as UsersIcon,
  MessageSquare as MessageSquareIcon,
  AlertTriangle as AlertTriangleIcon,
  FileText as FileTextIcon,
  List as ListIcon,
  Folder as FolderIcon,
  Power as PowerIcon,
  Menu as MenuIcon,
  Terminal as TerminalIcon,
} from 'react-feather'
import { Icon } from 'client/generic/components/icons/Icon'
import { Dropdown } from 'client/generic/components/dropdown/Dropdown'
import { DropdownToggle } from 'client/generic/components/dropdown/DropdownToggle'
import { DropdownMenu } from 'client/generic/components/dropdown/DropdownMenu'
import { DropdownDivider } from 'client/generic/components/dropdown/DropdownDivider'
import { Button } from 'client/generic/components/Button'

import 'client/app-admin/nav/Header.scss'

///

interface Props {
  onOpenSideNav: () => void
}

export function Header({ onOpenSideNav }: Props): JSX.Element | null {
  const { loggedIn, userToken } = useUser()
  const { signOut } = useUserDispatch()

  if (!loggedIn || !userToken || !isAdmin(userToken)) {
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
                <DropdownToggle className="btn btn-link nav-link">Rendszer</DropdownToggle>
                <DropdownMenu>
                  <NavLink activeClassName="active" className="dropdown-item" to="/user">
                    <Icon icon={UsersIcon} /> Felhasználók
                  </NavLink>
                  <NavLink activeClassName="active" className="dropdown-item" to="/feedback">
                    <Icon icon={MessageSquareIcon} /> Visszajelzések
                  </NavLink>
                  <NavLink activeClassName="active" className="dropdown-item" to="/utilities">
                    <Icon icon={AlertTriangleIcon} /> Gépház
                  </NavLink>
                  <NavLink
                    activeClassName="active"
                    className="dropdown-item"
                    to="/pocket-lisp-sandbox"
                  >
                    <Icon icon={TerminalIcon} /> Pocket Lisp sandbox
                  </NavLink>
                </DropdownMenu>
              </Dropdown>
            )}

            <Dropdown elementType="li">
              <DropdownToggle className="btn btn-link nav-link">Tartalom</DropdownToggle>
              <DropdownMenu>
                <NavLink activeClassName="active" className="dropdown-item" to="/exercise">
                  <Icon icon={FileTextIcon} /> Feladatok
                </NavLink>
                <NavLink activeClassName="active" className="dropdown-item" to="/exercise-sheet">
                  <Icon icon={ListIcon} /> Feladatsorok
                </NavLink>
                <NavLink activeClassName="active" className="dropdown-item" to="/classifications">
                  <Icon icon={FolderIcon} /> Kategóriák
                </NavLink>
                <DropdownDivider />
                <NavLink activeClassName="active" className="dropdown-item" to="/wiki-page">
                  Wiki oldalak
                </NavLink>
              </DropdownMenu>
            </Dropdown>

            <Dropdown elementType="li" right>
              <DropdownToggle className="btn btn-link nav-link">Profil</DropdownToggle>
              <DropdownMenu>
                <button className="dropdown-item btn btn-link " onClick={signOut}>
                  <Icon icon={PowerIcon} /> Kijelentkezés
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
          <MenuIcon size={48} />
        </Button>

        <NavLink exact to="/" className="logo-link float-right" aria-label="Főoldal">
          <div className="text-muted logo" />
        </NavLink>
      </div>
    </header>
  )
}
