import React from 'react'
import { UCMultiChoice } from 'shared/exercise/types'
import { UseModelProps, useModel } from 'client/generic/hooks/model'
import { Checkbox } from 'client/generic/components/form/input/Checkbox'
import { MarkdownWithScript } from 'client/script/components/MarkdownWithCode'

interface Props extends UseModelProps<boolean[]> {
  ctrl: UCMultiChoice
  readonly?: boolean
  disabled?: boolean
}

export function MultiChoice({ readonly, ctrl, disabled, ...bindProps }: Props): JSX.Element {
  const { bind } = useModel(bindProps)
  return (
    <div className="user-control uc-multi-choice">
      {readonly
        ? ctrl?.props?.options.map(({ label }, idx) => (
            <div key={idx}>
              <MarkdownWithScript source={label} />
            </div>
          ))
        : ctrl?.props?.options.map(({ label }, idx) => (
            <div key={idx}>
              <Checkbox {...bind(`${idx}`)} disabled={disabled}>
                <MarkdownWithScript source={label} />
              </Checkbox>
            </div>
          ))}
    </div>
  )
}
