import React, { ReactNode, useEffect } from 'react'
import * as ReactGa from 'react-ga'
import cx from 'classnames'
import { getScrollPos, storeScrollPos } from '../utils/localStore'

interface Props {
  storePosition?: boolean
  track?: boolean
  trackOptions?: Record<string, unknown>
  className?: string
  children: ReactNode
}

export function trackPage<T extends Record<string, unknown>>(page: string, options?: T): void {
  ReactGa.set({
    page,
    ...options,
  })
  ReactGa.pageview(page)
}

function getPageName(): string {
  return location.pathname
}

export function PublicPage({
  className,
  children,
  storePosition,
  track,
  trackOptions,
}: Props): JSX.Element {
  useEffect(() => {
    const pageName = getPageName()

    document.documentElement.scrollTop = storePosition ? getScrollPos(pageName) : 0

    if (track) {
      trackPage(pageName, trackOptions)
    }
    return () => {
      if (storePosition) {
        storeScrollPos(pageName, document.documentElement.scrollTop)
      }
    }
  }, [])

  return <section className={cx('page', className)}>{children}</section>
}

PublicPage.defaultProps = {
  storePosition: true,
  track: true,
}
