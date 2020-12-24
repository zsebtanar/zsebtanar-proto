import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { NavLink, withRouter } from 'react-router-dom'
import { Button } from 'client-common/component/general/Button'
import { Icon } from 'client-common/component/general/Icon'
import { isAdmin } from 'client-common/services/user'
import { signOut } from 'client-common/store/actions/auth'
import { openSideNav } from 'client-common/store/reducers/sideNav'
import { Dropdown } from 'client-common/component/general/dropdown/Dropdown'
import { DropdownMenu } from 'client-common/component/general/dropdown/DropdownMenu'
import { DropdownToggle } from 'client-common/component/general/dropdown/DropdownToggle'
import { DropdownDevider } from '../../client-common/component/general/dropdown/DropdownDevicer'

interface HeaderProps extends RouteComponentProps<{}> {}

interface HeaderStateProps {
  session: state.Session
  sideNav: state.SideNav
}

interface HeaderDispatchProps {
  signOut: typeof signOut
  openSideNav: typeof openSideNav
}

const mapStateToProps = (state: state.Root) => ({
  session: state.app.session,
  sideNav: state.app.sideNav
})

export const Header = withRouter(
  connect<HeaderStateProps, HeaderDispatchProps, HeaderProps>(
    mapStateToProps,
    { signOut, openSideNav }
  )(function HeaderComp(props: HeaderStateProps & HeaderDispatchProps & HeaderProps) {
    if (!props.session.signedIn) {
      return <div />
    }

    return (
      <header className="header clearfix">
        <div className="desktop-header">
          <nav>
            <ul className="nav nav-pills float-right">
              <li className="nav-item">
                <a className="nav-link" href="/">
                  Publikus
                </a>
              </li>
              {isAdmin(props.session.token) && (
                <Dropdown elementType="li">
                  <DropdownToggle>Rendszer</DropdownToggle>
                  <DropdownMenu>
                    <NavLink activeClassName="active" className="dropdown-item" to="/user">
                      <Icon fa="users" /> Felhasználók
                    </NavLink>
                    <NavLink activeClassName="active" className="dropdown-item" to="/feedback">
                      <Icon fa="commenting-o" /> Visszajelzések
                    </NavLink>
                    <NavLink activeClassName="active" className="dropdown-item" to="/utilities">
                      <Icon fa="exclamation-triangle" /> Gépház
                    </NavLink>
                  </DropdownMenu>
                </Dropdown>
              )}

              <Dropdown elementType="li">
                <DropdownToggle>Tartalom</DropdownToggle>
                <DropdownMenu>
                  <NavLink activeClassName="active" className="dropdown-item" to="/exercise">
                    <Icon fa="tasks" /> Feladatok
                  </NavLink>
                  <NavLink activeClassName="active" className="dropdown-item" to="/exercise-sheet">
                    <Icon fa="list-alt" /> Feladatsorok
                  </NavLink>
                  <NavLink activeClassName="active" className="dropdown-item" to="/classification">
                    <Icon fa="folder" /> Kategóriák
                  </NavLink>
                  <NavLink activeClassName="active" className="dropdown-item" to="/edit-rewards">
                    <Icon fa="trophy" /> Jutalmak szerkesztése
                  </NavLink>
                  <DropdownDevider />
                  <NavLink activeClassName="active" className="dropdown-item" to="/wiki-page">
                    <Icon fa="wikipedia-w" /> Wiki oldalak
                  </NavLink>
                </DropdownMenu>
              </Dropdown>

              <Dropdown elementType="li" right className="user-menu">
                <DropdownToggle>
                  <span className="fa-stack fa">
                    <i className="fa fa-circle fa-stack-2x" />
                    <i className="fa fa-user fa-stack-1x fa-inverse" />
                  </span>
                </DropdownToggle>
                <DropdownMenu>
                  <a href="#" className="dropdown-item" onClick={props.signOut}>
                    <Icon fa="power-off" /> Kijelentkezés
                  </a>
                </DropdownMenu>
              </Dropdown>
            </ul>
          </nav>
          <NavLink exact to="/" className="logo-link" aria-label="Főoldal">
            <h4 className="text-muted logo" />
          </NavLink>
        </div>

        <div className="mobile-header ">
          <Button
            className="navbar-toggle float-left"
            onAction={props.openSideNav}
            aria-expanded={props.sideNav.active}
            title="Menü megnyitása"
          >
            <span className="fa fa-bars fa-lg" />
          </Button>

          <NavLink exact to="/" className="logo-link float-right" aria-label="Főoldal">
            <h4 className="text-muted logo" />
          </NavLink>
        </div>
      </header>
    )
  })
)
