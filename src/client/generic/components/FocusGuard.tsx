import React, { ReactNode, createRef } from 'react'

interface Props {
  children: ReactNode
  onFocus?: () => void
  onBlur?: () => void
}

export class FocusGuard extends React.Component<Props, { focused: boolean }> {
  state = { focused: false }
  private wrapperRef = createRef<HTMLDivElement>()

  componentDidMount() {
    document.addEventListener('focus', this.handler, true)
  }

  componentWillUnmount() {
    document.removeEventListener('focus', this.handler, true)
  }

  private handler = event => {
    const contains = this.wrapperRef?.current?.contains(event.target)
    if (contains) {
      this.setState({ focused: true })
      this.props.onFocus?.()
    } else if (this.state.focused) {
      this.setState({ focused: false })
      this.props.onBlur?.()
    }
  }

  render() {
    return <div ref={this.wrapperRef}>{this.props.children}</div>
  }
}
