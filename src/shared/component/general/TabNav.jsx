import * as React from 'react'

export class TabNav extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      activeTabIndex: this.props.defaultTab || 0
    }
    this.handleTabClick = this.handleTabClick.bind(this)
  }

  // Toggle currently active tab
  handleTabClick(tabIndex) {
    this.setState({
      activeTabIndex:
        tabIndex === this.state.activeTabIndex ? this.props.defaultTab : tabIndex
    })
  }

  // Encapsulate <Tabs/> component API as props for <Tab/> children
  renderChildrenWithTabsApiAsProps() {
    return React.Children.map(this.props.children, (child, index) => {
      return React.cloneElement(child, {
        selectTab: this.handleTabClick,
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
    if (this.props.vertical) {
      return (
        <div className={`nav-vertical row ${this.props.className || ''}`}>
          <div className="col-3">
            <ul className="nav flex-column nav-pills" role="tablist">
              {this.renderChildrenWithTabsApiAsProps()}
            </ul>
          </div>
          <div className="col-9">{this.renderContent()}</div>
        </div>
      )
    } else {
      return (
        <div className={`nav ${this.props.className || ''}`}>
          <ul className={`nav ${this.props.navClassName || ''}`} role="tablist">
            {this.renderChildrenWithTabsApiAsProps()}
          </ul>

          {this.renderContent()}
        </div>
      )
    }
  }

  renderContent() {
    return (
      <div className="tab-content w-100">
        <div className="tab-pane active" role="tabpanel">
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
        href="#"
        className={`nav-link ${props.isActive ? 'active' : ''}`}
        onClick={event => {
          event.preventDefault()
          props.selectTab(props.tabIndex)
        }}
      >
        {props.label}
      </a>
    </li>
  )
}
