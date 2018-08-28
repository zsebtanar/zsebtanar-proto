import * as React from 'react'
import * as ReactGa from 'react-ga'
import { RouteComponentProps } from 'react-router'

export const trackPage = (page, options = {}) => {
  ReactGa.set({
    page,
    ...options
  })
  ReactGa.pageview(page)
}

export const withTracker = (WrappedComponent, options = {}) => {
  return class extends React.PureComponent<RouteComponentProps<{}>> {
    componentDidMount() {
      const page = this.props.location.pathname
      trackPage(page, options)
    }

    componentWillReceiveProps(nextProps) {
      const currentPage = this.props.location.pathname
      const nextPage = nextProps.location.pathname

      if (currentPage !== nextPage) {
        trackPage(nextPage)
      }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}
