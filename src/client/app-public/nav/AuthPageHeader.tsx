import { NavLink } from 'react-router-dom'
import React from 'react'

interface Props {
  children?: React.ReactNode
}

export function AuthPageHeader({ children }: Props) {
  return (
    <header className="header clearfix">
      <div className="container">
        <div className="desktop-header">
          <NavLink exact to="/">
            <div className="logo" />
          </NavLink>
          {children && (
            <nav>
              <ul className="nav nav-pills">
                {React.Children.map(children, item => (
                  <li>{item}</li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}
