import React, { Suspense } from 'react'
import { MarkdownProps } from 'client/markdown/types'
import { Loading } from 'client/generic/components'

const MarkdownBase = React.lazy(() => import(/* webpackChunkName: 'markdown' */ './MarkdownBase'))

export function Markdown(props: MarkdownProps) {
  return (
    <Suspense fallback={<Loading />}>
      <MarkdownBase {...props} />
    </Suspense>
  )
}
