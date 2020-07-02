import React from 'react'
import cx from 'classnames'
import { UCNumberList } from 'shared/exercise/types'
import { UseModelProps, useModel } from 'client/generic/hooks/model'
import { Input } from 'client/generic/components'
import { MarkdownWithScript } from 'client/script/components'
import { DecimalAccuracyWarning } from '../common/DecimalAccuracyWarning'

interface Props extends UseModelProps<string[]> {
  ctrl: UCNumberList
  readonly?: boolean
  disabled?: boolean
}

export function NumberList({ readonly, ctrl, disabled, ...bindProps }: Props) {
  const { bind } = useModel(bindProps)
  return (
    <div className={cx('user-control', 'uc-number-list', { multiline: ctrl.props.multiLine })}>
      <span className="prefix">
        {ctrl.props.prefix && <MarkdownWithScript source={ctrl.props.prefix} />}
      </span>
      {ctrl.props.fields.map((field, idx) => (
        <div key={idx}>
          <span className="prefix">
            {field.prefix && <MarkdownWithScript source={field.prefix} />}
          </span>
          {readonly ? (
            <span className="value mx-1">{ctrl.solution[idx]}</span>
          ) : (
            <Input
              {...bind(idx.toString())}
              type="number"
              disabled={disabled}
              step={1 / Math.pow(10, ctrl.props?.fractionDigits ?? 0)}
            />
          )}
          <span className="postfix">
            {field.postfix && <MarkdownWithScript source={field.postfix} />}
          </span>
        </div>
      ))}
      <span className="postfix">
        {ctrl.props.postfix && <MarkdownWithScript source={ctrl.props.postfix} />}
      </span>
      {ctrl.props?.fractionDigits > 0 && (
        <DecimalAccuracyWarning fractionDigits={ctrl.props.fractionDigits} />
      )}
    </div>
  )
}
