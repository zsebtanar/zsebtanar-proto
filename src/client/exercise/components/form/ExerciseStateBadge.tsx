import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faArchive, faEdit } from '@fortawesome/free-solid-svg-icons'
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
        <Badge type="primary">
          {props.short ? <FontAwesomeIcon title="Új" icon={faCheck} /> : 'Új'}
        </Badge>
      )
    case ExerciseState.Public:
      return (
        <Badge type="success">
          {props.short ? <FontAwesomeIcon title="Aktív" icon={faCheck} /> : 'Aktív'}
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
          {props.short ? <FontAwesomeIcon title="Vázlat" icon={faEdit} /> : 'Vázlat'}
        </Badge>
      )
  }
}
