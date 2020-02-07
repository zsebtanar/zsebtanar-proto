import React, { Suspense } from 'react'
import { MarkdownProps } from 'client/generic/components/markdown/types'
import { Loading } from 'client/generic/components/index'

const MarkdownBase = React.lazy(() => import(/* webpackChunkName: 'markdown' */ 'client/generic/components/markdown/MarkdownBase'))

export function Markdown(props: MarkdownProps) {
  return (
    <Suspense fallback={<Loading />}>
      <MarkdownBase {...props} />
    </Suspense>
  )
}
