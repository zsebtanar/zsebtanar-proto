import React, { ReactNode, useEffect } from 'react'
import * as ReactGa from 'react-ga'
import * as cx from 'classnames'
import { getScrollPos, storeScrollPos } from '../../exercise/util/localStore'

interface Props {
  storePosition?: boolean
  track?: boolean
  trackOptions?: object
  className?: string
  children: ReactNode
}

export function trackPage<T extends object>(page, options?: T) {
  ReactGa.set({
    page,
    ...options
  })
  ReactGa.pageview(page)
}

function getPageName(): string {
  return location.pathname
}

export function Page({
  className,
  children,
  storePosition = true,
  track = true,
  trackOptions = {}
}: Props) {
  useEffect(
    () => {
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
    },
    [track, trackOptions, storePosition]
  )

  return <section className={cx('page', className)}>{children}</section>
}

Page.defaultProps = {
  storePosition: true,
  track: true
}
