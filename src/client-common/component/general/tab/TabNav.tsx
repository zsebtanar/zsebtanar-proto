import * as React from 'react'
import { ReactElement } from 'react'

interface TabNavProps {
  defaultTab?: number
  vertical?: boolean
  className?: string
  navClassName?: string
}

interface TabNavState {
  activeTabIndex: number
}

export class TabNav extends React.Component<TabNavProps, TabNavState> {
  constructor(props, context) {
    super(props, context)
    this.state = {
      activeTabIndex: this.props.defaultTab || 0
    }
  }

  // Toggle currently active tab
  private handleTabClick = activeTabIndex => {
    this.setState({ activeTabIndex })
  }

  // Encapsulate <Tabs/> component API as props for <Tab/> children
  private renderChildrenWithTabsApiAsProps() {
    return React.Children.map(this.props.children, (child, index) => {
      return React.cloneElement(child as ReactElement<any>, {
        selectTab: this.handleTabClick,
        tabIndex: index,
        isActive: index === this.state.activeTabIndex
      })
    })
  }

  // Render current active tab content
  private renderActiveTabContent() {
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

  private renderContent() {
    return (
      <div className="tab-content w-100" key={this.state.activeTabIndex}>
        <div className="tab-pane active" role="tabpanel">
          {this.renderActiveTabContent()}
        </div>
      </div>
    )
  }
}

