import React from 'react'
import { WikiModal } from '../../wiki/modals/WikiModal'
import { MarkdownWithScript } from 'client/script/components/MarkdownWithCode'
import { useOverlayDispatch } from 'client/overlay/providers/OverlayProvider'

interface Props {
  className?: string
  source: string
}

export function ExerciseMarkdown({ source, className }: Props): JSX.Element {
  const { openModal } = useOverlayDispatch()

  return (
    <MarkdownWithScript
      className={className}
      source={source}
      onWikiLink={(pageId) => openModal(WikiModal({ pageId }))}
    />
  )
}
