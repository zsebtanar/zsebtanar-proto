import React from 'react'
import { useOverlayDispatch } from '../../overlay/providers'
import { WikiModal } from '../../wiki/modals/WikiModal'
import { MarkdownWithScript } from 'client/script/components/MarkdownWithCode'

interface Props {
  className?: string
  source: string
}

export function ExerciseMarkdown({ source, className }: Props) {
  const { openModal } = useOverlayDispatch()

  return (
    <MarkdownWithScript
      className={className}
      source={source}
      onWikiLink={pageId => openModal(WikiModal({ pageId }))}
    />
  )
}
