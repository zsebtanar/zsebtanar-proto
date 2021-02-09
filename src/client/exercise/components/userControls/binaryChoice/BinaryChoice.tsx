import React from 'react'
import { UCBinaryChoice } from 'shared/exercise/types'
import { UseModelProps, useModel } from 'client/generic/hooks/model'
import { MarkdownWithScript } from 'client/script/components/MarkdownWithCode'
import { RadioInput } from 'client/generic/components/form/input/RadioInput'

interface Props extends UseModelProps<boolean[]> {
  ctrl: UCBinaryChoice
  readonly?: boolean
  disabled?: boolean
}

export function BinaryChoice({ readonly, disabled, ctrl, ...bindProps }: Props): JSX.Element {
  const { bind } = useModel(bindProps)
  return (
    <div className="user-control uc-binary-choice">
      {ctrl.props?.options.map((option, idx) => (
        <div key={idx}>
          <div className="option-statement">
            {option.statement && <MarkdownWithScript source={option.statement} />}
          </div>
          {readonly ? (
            <div className="value">
              {ctrl.solution[idx] ? (
                <MarkdownWithScript source={option.trueLabel} />
              ) : (
                <MarkdownWithScript source={option.falseLabel} />
              )}
            </div>
          ) : (
            <div className="value">
              <RadioInput inputValue={true} {...bind(`${idx}`)} disabled={disabled}>
                <MarkdownWithScript source={option.trueLabel} />
              </RadioInput>
              <RadioInput inputValue={false} {...bind(`${idx}`)} disabled={disabled}>
                <MarkdownWithScript source={option.trueLabel} />
              </RadioInput>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
