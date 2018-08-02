import * as React from 'react'

interface DynamicComponentProps {
  comp: () => Promise<any>
  props?: any
}
interface DynamicComponentState {
  module?: any
}

export class DynamicComponent extends React.Component<
  DynamicComponentProps,
  DynamicComponentState
> {
  state = { module: null }

  componentDidMount() {
    const { comp } = this.props
    comp().then(module => this.setState({ module: module.default }))
  }

  render() {
    const Component = this.state.module
    return Component ? <Component {...this.props.props} /> : <div />
  }
}
