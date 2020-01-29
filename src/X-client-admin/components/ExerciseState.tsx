import { ExerciseStates } from 'client-common/services/exerciseService'
import * as React from 'react'
import { Icon } from 'client-common/component/general/Icon'

interface Props {
  value: ExerciseStates
  short: boolean
}

export function ExerciseState(props: Props) {
  switch (props.value) {
    case ExerciseStates.Active:
      return (
        <span className="badge badge-pill badge-success" title="Aktív">
          {props.short ? <Icon fa="check"/> : 'Aktív'}
        </span>
      )
    case ExerciseStates.Archive:
      return (
        <span className="badge badge-pill badge-dark" title="Arhivált">
          {props.short ? <Icon fa="archive"/> : 'Archivált'}
        </span>
      )
    case ExerciseStates.Draft:
    default:
      return (
        <span className="badge badge-pill badge-warning" title="Vázlat">
          {props.short ? <Icon fa="pencil"/> : 'Vázlat'}
        </span>
      )
  }
}
