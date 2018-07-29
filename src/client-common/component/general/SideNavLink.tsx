import { closeSideNav } from 'client-common/store/reducers/sideNav'
import { pipe } from 'ramda'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withRouter } from 'react-router-dom'

interface SideNavLinkProps {
  to: string
  exact?: boolean
  className?: string
  activeClassName?: string
  isActive?: () => boolean
  children: React.ReactNode
}

interface SideNavLinkStateProps {
  sideNavActive: boolean
}

interface SideNavLinkDispatchProps {
  closeSideNav: () => void
}

const mapStateToProps = state => ({
  sideNavActive: state.app.sideNav.active
})

export const SideNavLink = pipe(
  withRouter,
  connect<SideNavLinkStateProps, SideNavLinkDispatchProps, SideNavLinkProps>(
    mapStateToProps,
    { closeSideNav }
  )
)(function SideNavLinkComp(
  props: SideNavLinkStateProps & SideNavLinkDispatchProps & SideNavLinkProps & RouteComponentProps<{}>
) {
  const isActive = props.isActive ? props.isActive() : props.to === props.location.pathname

  const linkTo = e => {
    e.preventDefault()
    props.closeSideNav()
    props.history.push(props.to)
  }

  return (
    <a
      href=""
      className={`${props.className} ${isActive ? props.activeClassName : ''}`}
      onClick={linkTo}
    >
      {props.children}
    </a>
  )
})
