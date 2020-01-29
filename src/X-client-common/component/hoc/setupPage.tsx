import * as React from 'react'
import * as ReactGa from 'react-ga'
import * as cx from 'classnames'
import { RouteComponentProps } from 'react-router'
import { getScrollPos, storeScrollPos } from '../../../client/generic/utils/localStore'

interface PageOptions {
  storePosition?: boolean
  track?: boolean
  trackOptions?: any
  pageClassName?: string
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

export const setupPage = (options: PageOptions = {}) => WrappedComponent => {
  const opt = {...defaultOptions, ...options}
  return class extends React.PureComponent<RouteComponentProps<{}>> {
    private pageName: string

    componentDidMount() {
      this.pageName = this.getPageName()

      document.documentElement.scrollTop = opt.storePosition ? getScrollPos(this.pageName) : 0

      if (opt.track) {
        trackPage(this.pageName, opt.trackOptions)
      }
    }

    componentWillUnmount(): void {
      if (opt.storePosition) {
        storeScrollPos(this.pageName, document.documentElement.scrollTop)
      }
    }

    private getPageName(): string {
      return location.pathname
    }

    render() {
      const pageClassName = opt.pageClassName || WrappedComponent.name

      return (
        <div className={cx('page', pageClassName)}>
          <WrappedComponent {...this.props} />
        </div>
      )
    }
  }
}
