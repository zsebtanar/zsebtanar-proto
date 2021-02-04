import React from 'react'
import { UCSingleChoice } from 'shared/exercise/types'
import { UseModelProps } from 'client/generic/hooks/model'
import { RadioInput } from 'client/generic/components/form/input/RadioInput'
import { MarkdownWithScript } from 'client/script/components/MarkdownWithCode'

interface Props extends UseModelProps<number> {
  ctrl: UCSingleChoice
  readonly?: boolean
  disabled?: boolean
}

export function SingleChoice({ readonly, disabled, ctrl, ...bindProps }: Props): JSX.Element {
  return (
    <div className="user-control uc-single-choice">
      {readonly ? (
        <div className="">
          <MarkdownWithScript source={ctrl?.props?.options[ctrl.solution].label ?? ''} />
        </div>
      ) : (
        ctrl?.props?.options.map(({ label }, idx) => (
          <div key={idx}>
            <RadioInput inputValue={idx} {...bindProps} disabled={disabled}>
              <MarkdownWithScript source={label} />
            </RadioInput>
          </div>
        ))
      )}
    </div>
  )
}
