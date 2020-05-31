import React from 'react'
import { useOverlayDispatch } from '../../overlay/providers'
import { WikiModal } from '../../wiki/modals/WikiModal'
import { MarkdownWithScript } from 'client/script/components/MarkdownWithCode'
import { useExercise } from '../services/exerciseContext'

interface Props {
  className?: string
  source: string
}

export function ExerciseMarkdown({ source, className }: Props) {
  const { openModal } = useOverlayDispatch()
  const state = useExercise()

  return (
    <MarkdownWithScript
      className={className}
      source={source}
      resources={state.exercise.resources}
      onWikiLink={pageId => openModal(WikiModal({ pageId }))}
    />
  )
}
