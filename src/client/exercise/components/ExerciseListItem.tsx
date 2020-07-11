import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons/faPlay'
import { Markdown } from '../../generic/components/markdown/Markdown'
import { ClassificationLinkList } from '../../categories/components/ClassificationLinkList'
import { Classifications } from 'shared/exercise/types'
import { Link } from '../../generic/components/Link'

import './ExerciseListItem.scss'

interface Props {
  id: string
  mark?: string
  description: string
  classifications: Classifications
}

export function ExerciseListItem({ id, description, mark, classifications }: Props): JSX.Element {
  return (
    <div className="exercise-list-item">
      <div className="exercise-list-item-content">
        <Markdown source={description} mark={mark} />
        <div className="start-link text-right">
          <Link to={`/exercise/${id}`} className="stretched-link btn btn-link btn-sm">
            Feladat megoldás <FontAwesomeIcon icon={faPlay} />
          </Link>
        </div>
      </div>
      <ClassificationLinkList classifications={classifications} />
      <hr />
    </div>
  )
}
