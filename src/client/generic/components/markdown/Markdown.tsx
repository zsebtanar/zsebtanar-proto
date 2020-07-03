import React, { Suspense } from 'react'
import { MarkdownProps } from './types'
import { Loading } from '../Loading'

const MarkdownBase = React.lazy(() =>
  import(/* webpackChunkName: 'markdown' */ 'client/generic/components/markdown/MarkdownBase'),
)

export function Markdown(props: MarkdownProps): JSX.Element {
  return (
    <Suspense fallback={<Loading />}>
      <MarkdownBase {...props} />
    </Suspense>
  )
}
