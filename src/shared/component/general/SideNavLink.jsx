import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { closeSideNav } from 'shared/store/reducers/sideNav'

const mapStateToProps = state => ({
  sideNavActive: state.app.sideNav.active
})

export const SideNavLink = withRouter(
  connect(mapStateToProps, { closeSideNav })(function SideNavLinkComp(props) {
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
