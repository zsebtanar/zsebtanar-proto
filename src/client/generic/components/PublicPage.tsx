import React, { ReactNode, useEffect } from 'react'
import * as ReactGa from 'react-ga'
import cx from 'classnames'
import { getScrollPos, storeScrollPos } from '../utils/localStore'
import { useBackJourney } from '../providers/BackJourneyProvider'

interface Props {
  storePosition?: boolean
  track?: boolean
  trackOptions?: Record<string, unknown>
  className?: string
  children: ReactNode
  addToBackJourney?: boolean
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
  addToBackJourney,
}: Props): JSX.Element {
  const bj = useBackJourney()
  useEffect(() => {
    const pageName = getPageName()

    document.documentElement.scrollTop = storePosition ? getScrollPos(pageName) : 0

    if (track) {
      trackPage(pageName, trackOptions)
    }
    if (addToBackJourney) {
      bj.addEntry()
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
