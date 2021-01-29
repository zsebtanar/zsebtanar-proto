import React from 'react'
import {
  Check as CheckIcon,
  Archive as ArchiveIcon,
  File as FileIcon,
  Copy as CopyIcon,
  Edit3 as EditIcon,
} from 'react-feather'
import { ExerciseState } from 'shared/exercise/types'
import { Badge } from 'client/generic/components/Badge'
import { Icon } from 'client/generic/components/icons/Icon'

interface Props {
  value: ExerciseState
  short?: boolean
}

export const ExerciseStateBadge = (props: Props): React.ReactElement => {
  switch (props.value) {
    case ExerciseState.New:
      return (
        <Badge type="info">
          {props.short ? (
            <span title="Új feladat">
              <Icon icon={FileIcon} />
            </span>
          ) : (
            'Új feladat'
          )}
        </Badge>
      )
    case ExerciseState.Clone:
      return (
        <Badge type="danger">
          {props.short ? (
            <span title="Másolat">
              <Icon icon={CopyIcon} />
            </span>
          ) : (
            'Másolat'
          )}
        </Badge>
      )
    case ExerciseState.Public:
      return (
        <Badge type="success">
          {props.short ? (
            <span title="Publikus">
              <Icon icon={CheckIcon} />
            </span>
          ) : (
            'Publikus'
          )}
        </Badge>
      )
    case ExerciseState.Archived:
      return (
        <Badge type="dark">
          {props.short ? (
            <span title="Arhivált">
              <Icon icon={ArchiveIcon} />
            </span>
          ) : (
            'Archivált'
          )}
        </Badge>
      )
    case ExerciseState.Draft:
    default:
      return (
        <Badge type="warning">
          {props.short ? (
            <span title="Vázlat">
              <Icon icon={EditIcon} />
            </span>
          ) : (
            'Vázlat'
          )}
        </Badge>
      )
  }
}
