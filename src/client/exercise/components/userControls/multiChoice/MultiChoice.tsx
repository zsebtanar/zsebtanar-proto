import React from 'react'
import { UCMultiChoice } from 'shared/exercise/types'
import { UseModelProps, useModel } from 'client/generic/hooks/model'
import { Checkbox } from 'client/generic/components/form/input/Checkbox'
import { MarkdownWithScript } from 'client/script/components/MarkdownWithCode'
import { filledArray } from 'shared/utils/fn'

import './MultiChoice.scss'

interface Props extends UseModelProps<boolean[]> {
  ctrl: UCMultiChoice
  readonly?: boolean
  disabled?: boolean
}

export function MultiChoice({ readonly, ctrl, disabled, ...bindProps }: Props): JSX.Element {
  const { bind } = useModel({
    ...bindProps,
    defaultValue: filledArray(ctrl.props?.options.length ?? 0, false),
  })
  return (
    <div className="user-control uc-multi-choice">
      {readonly
        ? ctrl?.props?.options
            .filter((_, idx) => ctrl?.solution[idx])
            .map(({ label }, idx) => (
              <div key={idx} className="uc-multi-choice-item">
                <MarkdownWithScript source={label} />
              </div>
            ))
        : ctrl?.props?.options.map(({ label }, idx) => (
            <div key={idx} className="uc-multi-choice-item">
              <Checkbox {...bind(`${idx}`)} disabled={disabled}>
                <MarkdownWithScript source={label} />
              </Checkbox>
            </div>
          ))}
    </div>
  )
}
