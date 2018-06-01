import React from 'react'
import { withRouter } from 'react-router-dom'

import { connect } from 'react-redux'
import { signOut } from 'shared/store/actions/auth'
import { closeSideNav } from 'shared/store/reducers/sideNav'
import { SideNavLink } from 'shared/component/general/SideNavLink'

const mapStateToProps = state => ({
  session: state.app.session,
  sideNavActive: state.app.sideNav.active
})

export const SideNav = withRouter(
  connect(mapStateToProps, { signOut, closeSideNav })(function SideNavComp(props) {
    if (!props.session.signedIn || !props.sideNavActive) return <div />

    return (
      <div className="sidebar">
        <div className="sidebar-content clearfix flex-column d-flex">
          <div className="m-2 d-flex justify-content-between">
            <h4 className="my-0">
              <SideNavLink exact to="/">
                <span className="text-danger">Zsebtanár</span>
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
              <li className="nav-item">
                <SideNavLink activeClassName="active" className="nav-link" to="/user">
                  Felhasználók
                </SideNavLink>
              </li>

              <li className="nav-item">
                <SideNavLink activeClassName="active" className="nav-link" to="/feedback">
                  Visszajelzés
                </SideNavLink>
              </li>

              <li className="nav-item">
                <SideNavLink activeClassName="active" className="nav-link" to="/classification">
                  Kategóriák
                </SideNavLink>
              </li>

              <li className="nav-item">
                <SideNavLink activeClassName="active" className="nav-link" to="/exercise">
                  Feladatok
                </SideNavLink>
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
                <a href="" className="nav-link" onClick={props.signOut} title="Kijelentkezés">
                  Kijelentkezés
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    )
  })
)
