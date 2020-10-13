import React from 'react'
import { UCSingleNumber } from 'shared/exercise/types'
import { UseModelProps } from 'client/generic/hooks/model'
import { DecimalAccuracyWarning } from '../common/DecimalAccuracyWarning'

import './SingleNumber.scss'
import { MarkdownWithScript } from 'client/script/components/MarkdownWithCode'
import { Input } from 'client/generic/components/form/input/Input'

interface Props extends UseModelProps<string> {
  ctrl: UCSingleNumber
  readonly?: boolean
  disabled?: boolean
}

export function SingleNumber({ readonly, disabled, ctrl, ...bindProps }: Props): JSX.Element {
  return (
    <div className="user-control uc-simple-number d-flex align-items-center">
      <div className="prefix">
        {ctrl?.props?.prefix && <MarkdownWithScript source={ctrl?.props?.prefix} />}
      </div>
      {readonly ? (
        <strong>{bindProps.value}</strong>
      ) : (
        <Input
          {...bindProps}
          type="number"
          disabled={disabled}
          className="form-control col-4 mx-1"
          step={1 / Math.pow(10, ctrl?.props?.fractionDigits ?? 0)}
        />
      )}
      <div className="postfix">
        {ctrl?.props?.postfix && <MarkdownWithScript source={ctrl?.props?.postfix} />}
      </div>
      {(ctrl?.props?.fractionDigits ?? 0) > 0 && (
        <DecimalAccuracyWarning fractionDigits={ctrl?.props?.fractionDigits ?? 0} />
      )}
    </div>
  )
}
