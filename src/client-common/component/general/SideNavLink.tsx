import * as React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { closeSideNav } from 'client-common/store/reducers/sideNav'
import { RouteComponentProps } from 'react-router'

interface SideNavLinkProps extends RouteComponentProps<{}> {
  to: string
  className?: string
  activeClassName?: string
  sideNavActive: boolean
  closeSideNav: () => void
  isActive?: () => boolean
  children: React.ReactNode
}

interface SideNavLinkStateProps {
  sideNavActive: boolean
}

const mapStateToProps = state => ({
  sideNavActive: state.app.sideNav.active
})

export const SideNavLink = withRouter(
  connect<SideNavLinkStateProps, {}, SideNavLinkProps>(
    mapStateToProps,
    { closeSideNav }
  )(function SideNavLinkComp(props: SideNavLinkProps) {
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
)
