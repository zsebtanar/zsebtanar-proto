import { Button } from 'client-common/component/general/Button'
import { Dropdown } from 'client-common/component/general/dropdown/Dropdown'
import { DropdownMenu } from 'client-common/component/general/dropdown/DropdownMenu'
import { DropdownToggle } from 'client-common/component/general/dropdown/DropdownToggle'
import { Link } from 'client-common/component/general/Link'
import { isAdmin } from 'client-common/services/user'
import { signOut } from 'client-common/store/actions/auth'
import { openSignInModal, openSignUpModal } from 'client-common/store/actions/modal'
import { openSideNav } from 'client-common/store/reducers/sideNav'
import * as React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Icon } from '../../client-common/component/general/Icon'

import './Header.scss'

interface StoreProps {
  session: state.Session
  sideNav: state.SideNav
}

interface DispatchProps {
  signOut: typeof signOut
  openSideNav: typeof openSideNav
  openSignInModal: typeof openSignInModal
  openSignUpModal: typeof openSignUpModal
}

type AllProps = StoreProps & DispatchProps

///

const mapStateToProps = state => ({
  session: state.app.session,
  sideNav: state.app.sideNav
})

export const Header = connect<StoreProps, DispatchProps, {}>(
  mapStateToProps,
  {
    signOut,
    openSideNav,
    openSignInModal,
    openSignUpModal
  }
)(function HeaderComp(props: AllProps) {
  const { signedIn, token } = props.session
  var numberOfRewards = 0
  if(signedIn){
    // TODO reward count refresh during user session
    const rewards = (props.session && props.session.userDetails && props.session.userDetails.rewards)
    if (rewards) {
      numberOfRewards = Object.keys(rewards).length
    }
  }
  return (
    <header className="header clearfix">
      <div className="container">
        <div className="desktop-header">
          <NavLink exact to="/">
            <div className="logo" />
          </NavLink>
          <nav>
            <ul className="nav nav-pills">
              {signedIn && isAdmin(token) ? adminMenu() : ''}
              {signedIn ? signedInMenu(props, numberOfRewards) : anonymousUserMenu(props)}
            </ul>
          </nav>
        </div>

        <div className="mobile-header">
          <NavLink exact to="/" className="logo-link" aria-label="Főoldal">
            <div className="logo" />
          </NavLink>
          <ul className="nav nav-pills">
              {signedIn ? renderRewardBox(numberOfRewards) : ''}
          </ul>
          <Button
            className="navbar-toggle"
            onAction={props.openSideNav}
            aria-expanded={props.sideNav.active}
            title="Menü megnyitása"
          >
            <span className="fa fa-bars fa-lg" />
          </Button>
        </div>
      </div>
    </header>
  )
})

function signedInMenu(props: AllProps, numberOfRewards) {
  return (
    <>
      {renderRewardBox(numberOfRewards)}
      <Dropdown elementType="li" className="user-menu" right key="user-menu">
        <DropdownToggle>
          <span className="fa-stack fa">
            <i className="fa fa-circle fa-stack-2x" />
            <i className="fa fa-user fa-stack-1x fa-inverse" />
          </span>
        </DropdownToggle>
        <DropdownMenu>
          <NavLink exact to="/profile" className="dropdown-item">
            Profil
        </NavLink>
        <NavLink exact to="/rewards" className="dropdown-item">
          Jutalmak
        </NavLink>
        <a href="#" className="dropdown-item" onClick={props.signOut}>
          Kijelentkezés
        </a>
        </DropdownMenu>
      </Dropdown>
    </>
  )
}

function renderRewardBox(numberOfRewards) {
  return (
  <>
    <li className="reward-box"><NavLink exact to="/Rewards">{numberOfRewards}</NavLink></li>
    <li className="reward-box"><NavLink exact to="/Rewards"><div className="trophy-filled" /></NavLink></li>
  </>)
}

function anonymousUserMenu(props: AllProps) {
  return (
    <>
      <li className="nav-item" key="sign-up">
        <Link className="nav-link" onAction={props.openSignUpModal}>
          <Icon fa="plus" /> Regisztráció
        </Link>
      </li>
      <li className="nav-item" key="sign-in">
        <Link className="nav-link" onAction={props.openSignInModal}>
          <Icon fa="sign-in" /> Belépés
        </Link>
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
