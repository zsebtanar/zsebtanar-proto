import React from 'react'
import { UCSingleNumber } from 'shared/exercise/types'
import { UseModelProps } from 'client/generic/hooks/model'
import { Markdown, Input } from 'client/generic/components'
import { DecimalAccuracyWarning } from '../common/DecimalAccuracyWarning'

interface Props extends UseModelProps<string> {
  ctrl: UCSingleNumber
  readonly: boolean
}

export function SingleNumber({ readonly, ctrl, ...bindProps }: Props) {
  return (
    <div className="user-control simple-text d-flex align-items-center">
      <span className="prefix">
        {ctrl.props.prefix && <Markdown source={ctrl.props.prefix} resources={{}} />}
      </span>
      {readonly ? (
        <strong>
          &nbsp;
          {bindProps.value}
          &nbsp;
        </strong>
      ) : (
        <Input
          {...bindProps}
          type="number"
          className="form-control col-4 mx-1"
          step={1 / Math.pow(10, ctrl.props.fractionDigits || 0)}
        />
      )}
      <span className="postfix">
        {ctrl.props.postfix && <Markdown source={ctrl.props.postfix} resources={{}} />}
      </span>
      {ctrl.props.fractionDigits > 0 && (
        <DecimalAccuracyWarning fractionDigits={ctrl.props.fractionDigits} />
      )}
    </div>
  )
}
