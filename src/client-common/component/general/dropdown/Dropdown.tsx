import { propEq } from 'ramda'
import * as React from 'react'
import { ReactElement } from 'react'
import { uid } from 'client-common/util/uuid'
import { DropdownMenu } from './DropdownMenu'
import { DropdownToggle } from './DropdownToggle'

interface DropdownProps {
  elementType?: string
  right?: boolean
  className?: string
  dropUp?: boolean
  children?: React.ReactNode
}

interface DropdownState {
  open: boolean
}

export class Dropdown extends React.Component<DropdownProps, DropdownState> {
  state = { open: false }

  private id = `id-dd-${uid()}`
  private menuRef: HTMLElement

  private getComponent(type) {
    return (this.props.children as ReactElement<any>[]).filter(propEq('type', type))
  }

  private toggleDropdown = open => {
    this.setState({ open })
  }

  private hide = () => this.toggleDropdown(false)

  private show = () => this.toggleDropdown(true)

  private getMenuRef = ref => (this.menuRef = ref)

  render() {
    const { dropUp, className } = this.props
    const Elm = this.props.elementType || 'div'
    return (
      <Elm
        className={`nav-item ${dropUp ? 'dropup' : 'dropdown'} ${className || ''} ${
          this.state.open ? 'show' : ''
        }`}
        ref={this.getMenuRef}
        onMouseEnter={this.show}
        onMouseLeave={this.hide}
        onMouseUp={this.hide}
      >
        {this.renderToggle()}
        {this.renderMenu()}
      </Elm>
    )
  }

  private renderToggle() {
    const toggle = this.getComponent(DropdownToggle)
    return React.Children.map(toggle, child =>
      React.cloneElement(child as ReactElement<any>, {
        id: this.id,
        active: this.state.open
      })
    )
  }

  private renderMenu() {
    const menu = this.getComponent(DropdownMenu)
    return React.Children.map(menu, child =>
      React.cloneElement(child as ReactElement<any>, {
        id: this.id,
        active: this.state.open,
        className: this.props.right ? 'dropdown-menu-right' : ''
      })
    )
  }
}
