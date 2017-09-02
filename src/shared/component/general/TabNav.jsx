import * as React from 'react'

export class TabNav extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      activeTabIndex: this.props.defaultActiveTabIndex || 0
    }
    this.handleTabClick = this.handleTabClick.bind(this)
  }

  // Toggle currently active tab
  handleTabClick(tabIndex) {
    this.setState({
      activeTabIndex: tabIndex === this.state.activeTabIndex ? this.props.defaultActiveTabIndex : tabIndex
    })
  }

  // Encapsulate <Tabs/> component API as props for <Tab/> children
  renderChildrenWithTabsApiAsProps() {
    return React.Children.map(this.props.children, (child, index) => {
      return React.cloneElement(child, {
        onClick: this.handleTabClick,
        tabIndex: index,
        isActive: index === this.state.activeTabIndex
      })
    })
  }

  // Render current active tab content
  renderActiveTabContent() {
    const { children } = this.props
    const { activeTabIndex } = this.state
    if (children[activeTabIndex]) {
      return children[activeTabIndex].props.children
    }
  }

  render() {
    return (
      <div className={`nav ${this.props.className || ''}`}>
        <ul className={`nav ${this.props.navClassName || ''}`}>{this.renderChildrenWithTabsApiAsProps()}</ul>
        <div className="tab-pane active w-100" role="tabpanel">
          {this.renderActiveTabContent()}
        </div>
      </div>
    )
  }
}

export const Tab = props => {
  return (
    <li className="nav-item">
      <a
        href='#'
        className={`nav-link ${props.isActive ? 'active' : ''}`}
        onClick={event => {
          event.preventDefault()
          props.onClick(props.tabIndex)
        }}
      >
        {props.label}
      </a>
    </li>
  )
}
