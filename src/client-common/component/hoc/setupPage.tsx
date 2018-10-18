import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { getScrollPos, storeScrollPos } from '../util/localStore'
import * as ReactGa from 'react-ga'

interface PageOptions {
  storePosition?: boolean
  track?: boolean
  trackOptions?: any
}

const defaultOptions: PageOptions = {
  storePosition: true,
  track: true
}

export const trackPage = (page, options = {}) => {
  ReactGa.set({
    page,
    ...options
  })
  ReactGa.pageview(page)
}

export const setupPage = (options: PageOptions = defaultOptions) => WrappedComponent => {
  return class extends React.PureComponent<RouteComponentProps<{}>> {
    private pageName: string

    componentDidMount() {
      this.pageName = this.getPageName()

      document.documentElement.scrollTop = options.storePosition ? getScrollPos(this.pageName) : 0

      if (options.track) {
        trackPage(this.pageName, options.trackOptions)
      }
    }

    componentWillUnmount(): void {
      if (options.storePosition) {
        storeScrollPos(this.pageName, document.documentElement.scrollTop)
      }
    }

    private getPageName(): string {
      return location.pathname
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}
