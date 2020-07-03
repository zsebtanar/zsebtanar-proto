import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faBan } from '@fortawesome/free-solid-svg-icons'
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
        ? ctrl.props.options.map(({ label }, idx) => (
            <div className="row" key={idx}>
              <FontAwesomeIcon icon={ctrl.solution[idx] ? faCheck : faBan} className="col-1" />
              <MarkdownWithScript source={label} className="col-11" />
            </div>
          ))
        : ctrl.props.options.map(({ label }, idx) => (
            <div className="row" key={idx}>
              <Checkbox {...bind(`${idx}`)} disabled={disabled}>
                <MarkdownWithScript source={label} />
              </Checkbox>
            </div>
          ))}
    </div>
  )
}
