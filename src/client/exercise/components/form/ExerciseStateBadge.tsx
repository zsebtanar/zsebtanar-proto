import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faArchive, faFile, faClone, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { ExerciseState } from 'shared/exercise/types'
import { Badge } from 'client/generic/components/Badge'

interface Props {
  value: ExerciseState
  short?: boolean
}

export const ExerciseStateBadge = (props: Props): React.ReactElement => {
  switch (props.value) {
    case ExerciseState.New:
      return (
        <Badge type="info">
          {props.short ? <FontAwesomeIcon title="Új feladat" icon={faFile} /> : 'Új feladat'}
        </Badge>
      )
    case ExerciseState.Clone:
      return (
        <Badge type="danger">
          {props.short ? <FontAwesomeIcon title="Másolat" icon={faClone} /> : 'Másolat'}
        </Badge>
      )
    case ExerciseState.Public:
      return (
        <Badge type="success">
          {props.short ? <FontAwesomeIcon title="Publikus" icon={faCheck} /> : 'Publikus'}
        </Badge>
      )
    case ExerciseState.Archived:
      return (
        <Badge type="dark">
          {props.short ? <FontAwesomeIcon title="Arhivált" icon={faArchive} /> : 'Archivált'}
        </Badge>
      )
    case ExerciseState.Draft:
    default:
      return (
        <Badge type="warning">
          {props.short ? <FontAwesomeIcon title="Vázlat" icon={faPencilAlt} /> : 'Vázlat'}
        </Badge>
      )
  }
}
