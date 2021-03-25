import React from 'react'
import { UCFractionNumber } from 'shared/exercise/types'
import { FractionNumber } from 'shared/math/fractionNumber'
import { UseModelProps, useModel } from 'client/generic/hooks/model'
import { MarkdownWithScript } from 'client/script/components/MarkdownWithCode'
import { NumberInput } from 'client/generic/components/form/input/NumberInput'

import './FractionNumberComponent.scss'

interface Props extends UseModelProps<FractionNumber> {
  ctrl: UCFractionNumber
  readonly?: boolean
  disabled?: boolean
}

export function FractionNumberComponent({
  readonly,
  disabled,
  ctrl,
  ...bindProps
}: Props): JSX.Element {
  const { bind } = useModel<FractionNumber>(bindProps)

  return (
    <div className="user-control uc-fraction-number d-flex align-items-center">
      <div className="prefix">
        {ctrl?.props?.prefix && <MarkdownWithScript source={ctrl?.props.prefix} />}
      </div>
      {readonly ? (
        <div className="mx-2 text-center">
          <strong>&nbsp;{bindProps.value?.numerator}&nbsp;</strong>
          <div className="separator" />
          <strong>&nbsp;{bindProps.value?.denominator}&nbsp;</strong>
        </div>
      ) : (
        <div className="inputs mx-1">
          <NumberInput
            {...bind('numerator')}
            value={bindProps.value?.numerator}
            disabled={disabled}
            className="form-control"
            step={1}
            onKeyPress={onlyNumbers}
            placeholder="számláló"
          />
          <div className="separator" />
          <NumberInput
            {...bind('denominator')}
            value={bindProps.value?.denominator}
            disabled={disabled}
            className="form-control"
            onKeyPress={onlyNumbers}
            step={1}
            placeholder="nevező"
          />
        </div>
      )}
      <div className="postfix">
        {ctrl?.props?.postfix && <MarkdownWithScript source={ctrl.props.postfix} />}
      </div>
    </div>
  )
}

const onlyNumbers = (event) => {
  if (!/[-0-9]/.test(event.key)) event.preventDefault()
}
