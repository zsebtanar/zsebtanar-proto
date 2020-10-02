import React from 'react'
import { ExerciseModel, ExerciseState } from 'shared/exercise/types'
import { Button } from 'client/generic/components/Button'
import { faArchive, faCheck, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { ConfirmModal } from '../../overlay/components/ConfirmModal'
import { useOverlayDispatch } from '../../overlay/providers/OverlayProvider'
import { Link } from '../../generic/components/Link'
import { ExternalLink } from '../../generic/components/ExternalLink'

interface Props {
  exercise: ExerciseModel
  onAction: (es: ExerciseState) => void
}

export const ExerciseOperations = ({ exercise, onAction }: Props): React.ReactElement => {
  const { openModal } = useOverlayDispatch()

  const handleAction = async (es: ExerciseState) => {
    if (es === ExerciseState.Remove) {
      const res = await openModal(
        <ConfirmModal buttonType="danger">Biztos törlöd a feladatot?</ConfirmModal>,
      )
      if (!res) return
    }
    onAction(es)
  }

  return (
    <div>
      <ExternalLink href={`/exercise/${exercise.id}`} className="btn btn-sm btn-link">
        Megtekintés
      </ExternalLink>{' '}
      {exercise.state === ExerciseState.Public && (
        <Button
          btn="outline-dark"
          small
          onAction={() => handleAction(ExerciseState.Archived)}
          icon={faArchive}
        >
          Archiválás
        </Button>
      )}{' '}
      {(exercise.state === ExerciseState.Draft || exercise.state === ExerciseState.Archived) && (
        <Button
          btn="outline-success"
          small
          onAction={() => handleAction(ExerciseState.Public)}
          icon={faCheck}
        >
          Aktiválás
        </Button>
      )}{' '}
      {
        <Button
          btn="outline-danger"
          small
          onAction={() => handleAction(ExerciseState.Remove)}
          icon={faTrashAlt}
        >
          Törlés
        </Button>
      }
    </div>
  )
}
