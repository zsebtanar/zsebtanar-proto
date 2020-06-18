import React from 'react'
import { UCBinaryChoice } from 'shared/exercise/types'
import { UseModelProps, useModel } from 'client/generic/hooks/model'
import { RadioInput } from 'client/generic/components'
import { MarkdownWithScript } from 'client/script/components'

interface Props extends UseModelProps<boolean[]> {
  ctrl: UCBinaryChoice
  readonly?: boolean
  disabled?: boolean
}

export function BinaryChoice({ readonly, disabled, ctrl, ...bindProps }: Props) {
  const { bind } = useModel(bindProps)
  return (
    <div className="user-control uc-binary-choice">
      {ctrl.props?.options.map((option, idx) => (
        <div key={idx}>
          <span className="option-statement">
            {option.statement && <MarkdownWithScript source={option.statement} />}
          </span>
          {readonly ? (
            <span className="value mx-1">
              {ctrl.solution[idx] ? (
                <MarkdownWithScript source={option.trueLabel} />
              ) : (
                <MarkdownWithScript source={option.falseLabel} />
              )}
            </span>
          ) : (
            <span className="value mx-1">
              <RadioInput inputValue={true} {...bind(`${idx}`)} disabled={disabled}>
                <MarkdownWithScript source={option.trueLabel} />
              </RadioInput>
              <RadioInput inputValue={false} {...bind(`${idx}`)} disabled={disabled}>
                <MarkdownWithScript source={option.trueLabel} />
              </RadioInput>
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
