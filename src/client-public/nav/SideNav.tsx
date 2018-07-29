import { SideNavLink } from 'client-common/component/general/SideNavLink'
import { isAdmin } from 'client-common/services/user'
import { signOut } from 'client-common/store/actions/auth'
import { closeSideNav } from 'client-common/store/reducers/sideNav'
import { pipe } from 'ramda'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withRouter } from 'react-router-dom'

interface SideNavStateProps {
  session: state.Session
  sideNavActive: state.SideNav['active']
}

interface SideNavDispatchProps {
  signOut: typeof signOut
  closeSideNav: typeof closeSideNav
}

const mapStateToProps = (state: state.Root) => ({
  session: state.app.session,
  sideNavActive: state.app.sideNav.active
})

export const SideNav = pipe(
  withRouter,
  connect(
    mapStateToProps,
    { signOut, closeSideNav }
  )
)(function SideNavComp(props: SideNavStateProps & SideNavDispatchProps & RouteComponentProps<{}>) {
  if (!props.session.signedIn || !props.sideNavActive) {
    return <div />
  }

  return (
    <div className="sidebar">
      <div className="sidebar-content clearfix flex-column d-flex">
        <div className="m-2 d-flex justify-content-between align-items-center">
          <h4 className="my-0">
            <SideNavLink exact to="/">
              <span className="text-muted">Zsebtanár</span>
            </SideNavLink>
          </h4>
          <button type="button" className="close" data-dismiss="modal" aria-label="Menü bezárás">
            <span aria-hidden={true} onClick={props.closeSideNav}>
              &times;
            </span>
          </button>
        </div>
        <nav className="mobile-nav">
          <ul className="nav nav-pills flex-column">
            {props.session.signedIn && isAdmin(props.session.userDetails) ? (
              <li className="nav-item" key="admin">
                <a href="/admin/exercise" className="nav-link">
                  Admin
                </a>
              </li>
            ) : (
              ''
            )}
            {props.session.signedIn
              ? [
                  <li className="nav-item" key="sing-out">
                    <a href="#" className="nav-link" onClick={props.signOut}>
                      Kijelentkezés
                    </a>
                  </li>
                ]
              : [
                  <li className="nav-item" key="sign-up">
                    <SideNavLink activeClassName="active" className="nav-link" to="/sign-up">
                      <i className="fa fa-plus" /> Regisztráció
                    </SideNavLink>
                  </li>,
                  <li className="nav-item" key="sign-in">
                    <SideNavLink activeClassName="active" className="nav-link" to="/sign-in">
                      <i className="fa fa-sign-in" /> Belépés
                    </SideNavLink>
                  </li>
                ]}
          </ul>
        </nav>
      </div>
    </div>
  )
})
