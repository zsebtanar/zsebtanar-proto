import * as cx from 'classnames'
import { SideNavLink } from 'client-common/component/general/SideNavLink'
import { isAdmin } from 'client-common/services/user'
import { signOut } from 'client-common/store/actions/auth'
import { closeSideNav } from 'client-common/store/reducers/sideNav'
import { pipe } from 'ramda'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withRouter } from 'react-router-dom'
import { CloseButton } from '../../client-common/component/general/CloseButton'
import { openSignInModal, openSignUpModal } from '../../client-common/store/actions/modal'

import './SideNav.scss'

interface StoreProps {
  session: state.Session
  sideNavActive: state.SideNav['active']
}

interface DispatchProps {
  signOut: typeof signOut
  closeSideNav: typeof closeSideNav
  openSignInModal: typeof openSignInModal
  openSignUpModal: typeof openSignUpModal
}

type AllProps = StoreProps & DispatchProps & RouteComponentProps<{}>

///

const mapStateToProps = (state: state.Root) => ({
  session: state.app.session,
  sideNavActive: state.app.sideNav.active
})

export const SideNav = pipe(
  withRouter,
  connect(
    mapStateToProps,
    { signOut, closeSideNav, openSignInModal, openSignUpModal }
  )
)(function SideNavComp(props: AllProps) {
  const active = props.sideNavActive

  return (
    <nav className={cx('sidebar', { active })} aria-hidden={!active}>
      <div className="sidebar-content clearfix flex-column d-flex">
        <div className="m-2 d-flex justify-content-between align-items-center">
          <h4 className="my-0">
            <SideNavLink exact to="/">
              <span className="text-muted">Zsebtanár</span>
            </SideNavLink>
          </h4>
          <CloseButton onClick={props.closeSideNav} aria-label="Menü bezárása" />
        </div>
        <nav className="mobile-nav">
          <ul className="nav nav-pills flex-column">
            {props.session.signedIn && isAdmin(props.session.userDetails) ? adminMenu() : ''}
            {props.session.signedIn ? signedInMenu(props) : anonymousUserMenu(props)}
          </ul>
        </nav>
      </div>
    </nav>
  )
})

function signedInMenu(props: AllProps) {
  return (
    <li className="nav-item" key="sing-out">
      <a href="#" className="nav-link" onClick={props.signOut}>
        Kijelentkezés
      </a>
    </li>
  )
}

function anonymousUserMenu(props: AllProps) {
  return (
    <>
      <li className="nav-item" key="sign-up">
        <SideNavLink activeClassName="active" className="nav-link" onAction={props.openSignUpModal}>
          <i className="fa fa-plus" /> Regisztráció
        </SideNavLink>
      </li>
      <li className="nav-item" key="sign-in">
        <SideNavLink activeClassName="active" className="nav-link" onAction={props.openSignInModal}>
          <i className="fa fa-sign-in" /> Belépés
        </SideNavLink>
      </li>
    </>
  )
}

function adminMenu() {
  return (
    <li className="nav-item" key="admin">
      <a href={'/admin/exercise'} className="nav-link">
        Admin
      </a>
    </li>
  )
}
