import * as React from 'react'
import { useDispatch } from 'react-redux'
import { Markdown } from '../../../client-common/component/general/Markdown'
import { openWikiModal } from '../../../client-common/store/actions/modal'
import { useExercise } from '../service/exerciseContext'

interface Props {
  className?: string
  source: MarkdownString
}

export function ExerciseMarkdown({ source, className }: Props) {
  const storeDispatch = useDispatch()
  const state = useExercise()

  return (
    <Markdown
      className={className}
      source={source}
      resources={state.exercise.resources}
      onWikiLink={pageId => storeDispatch(openWikiModal({ pageId }))}
    />
  )
}
