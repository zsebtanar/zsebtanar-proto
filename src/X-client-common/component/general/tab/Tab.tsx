import * as React from 'react'

interface TabProps {
  tabComponent?: string
  isActive?: boolean
  tabIndex?: number
  label: string
  selectTab?: (index: number) => void
}

export const Tab = (props: TabProps) => {
  const Content = props.tabComponent || 'span'
  return (
    <li className="nav-item">
      <a
        href="#"
        className={`nav-link ${props.isActive ? 'active' : ''}`}
        onClick={event => {
          event.preventDefault()
          props.selectTab(props.tabIndex)
        }}
      >
        <Content>{props.label}</Content>
      </a>
    </li>
  )
}