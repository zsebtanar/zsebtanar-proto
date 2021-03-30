import React from 'react'
import cx from 'classnames'
import { UCNumberList } from 'shared/exercise/types'
import { UseModelProps, useModel } from 'client/generic/hooks/model'
import { DecimalAccuracyWarning } from '../common/DecimalAccuracyWarning'
import { MarkdownWithScript } from 'client/script/components/MarkdownWithCode'
import { Input } from 'client/generic/components/form/input/Input'

import './NumberList.scss'

interface Props extends UseModelProps<string[]> {
  ctrl: UCNumberList
  readonly?: boolean
  disabled?: boolean
}

export function NumberList({ readonly, ctrl, disabled, ...bindProps }: Props): JSX.Element {
  const { bind } = useModel({ ...bindProps, defaultValue: [] })
  return (
    <div className={cx('user-control', 'uc-number-list', { multiline: ctrl?.props?.multiLine })}>
      <div className="uc-number-list-body">
        <div className="prefix">
          {ctrl.props?.prefix && <MarkdownWithScript source={ctrl.props?.prefix} />}
        </div>
        {ctrl.props?.fields?.map((field, idx) => (
          <div className="uc-number-list-item" key={idx}>
            <div className="prefix">
              {field.prefix && <MarkdownWithScript source={field.prefix} />}
            </div>
            {readonly ? (
              <span className="value mx-1">{ctrl.solution[idx]}</span>
            ) : (
              <Input
                {...bind(idx.toString())}
                value={bindProps?.value?.[idx] ?? ''}
                type="number"
                className="form-control col-4 mx-1"
                disabled={disabled}
                step={1 / Math.pow(10, ctrl.props?.fractionDigits ?? 0)}
              />
            )}
            <div className="postfix">
              {field.postfix && <MarkdownWithScript source={field.postfix} />}
            </div>
          </div>
        ))}
        <div className="postfix">
          {ctrl.props?.postfix && <MarkdownWithScript source={ctrl.props?.postfix} />}
        </div>
      </div>
      {(ctrl?.props?.fractionDigits ?? 0) > 0 && (
        <DecimalAccuracyWarning fractionDigits={ctrl?.props?.fractionDigits ?? 0} />
      )}
    </div>
  )
}
