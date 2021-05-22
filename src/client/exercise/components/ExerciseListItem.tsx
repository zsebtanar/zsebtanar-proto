import React from 'react'
import { Markdown } from '../../generic/components/markdown/Markdown'
import { ClassificationLinkList } from '../../classification/components/ClassificationLinkList'
import { Link } from '../../generic/components/Link'

import './ExerciseListItem.scss'

interface Props {
  id: string
  mark?: string
  description: string
  classifications: string[]
}

export function ExerciseListItem({ id, description, mark, classifications }: Props): JSX.Element {
  return (
    <div className="exercise-list-item">
      <div className="exercise-list-item-content">
        <Markdown source={description} mark={mark} />
        <div className="start-link text-right">
          <Link to={`/exercise/${id}`} className="stretched-link btn btn-link btn-sm">
            Feladat megoldás
          </Link>
        </div>
      </div>
      <ClassificationLinkList classifications={classifications} />
      <hr />
    </div>
  )
}
