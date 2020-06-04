import React from 'react'
import { UCFractionNumber } from 'shared/exercise/types'
import { FractionNumber } from 'shared/math/fractionNumber'
import { UseModelProps, useModel } from 'client/generic/hooks/model'
import { Input } from 'client/generic/components'
import { MarkdownWithScript } from 'client/script/components'

interface Props extends UseModelProps<FractionNumber> {
  ctrl: UCFractionNumber
  readonly: boolean
}

export function FractionNumberComponent({ readonly, ctrl, ...bindProps }: Props) {
  const { bind } = useModel<FractionNumber>(bindProps)

  return (
    <div className="user-control uc-fraction-number d-flex align-items-center">
      <span className="prefix">
        {ctrl.props.prefix && <MarkdownWithScript source={ctrl.props.prefix} resources={{}} />}
      </span>
      {readonly ? (
        <div className="mx-2 text-center">
          <strong>&nbsp;{bindProps.value?.numerator}&nbsp;</strong>
          <hr className="my-1" />
          <strong>&nbsp;{bindProps.value?.denominator}&nbsp;</strong>
        </div>
      ) : (
        <>
          <Input
            {...bind('numerator')}
            type="number"
            className="form-control"
            step={1}
            onKeyPress={onlyNumbers}
            placeholder="számláló"
          />
          <hr className="my-1" />
          <Input
            {...bind('denominator')}
            type="number"
            className="form-control"
            onKeyPress={onlyNumbers}
            step={1}
            placeholder="nevező"
          />
        </>
      )}
      <span className="postfix">
        {ctrl.props.postfix && <MarkdownWithScript source={ctrl.props.postfix} resources={{}} />}
      </span>
    </div>
  )
}

const onlyNumbers = event => {
  if (!/[-0-9]/.test(event.key)) event.preventDefault()
}
