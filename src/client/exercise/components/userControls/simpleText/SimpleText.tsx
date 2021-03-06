import React from 'react'
import { UseModelProps } from 'client/generic/hooks/model'
import { UCSimpleText } from 'shared/exercise/types'
import { MarkdownWithScript } from 'client/script/components/MarkdownWithCode'
import { Input } from 'client/generic/components/form/input/Input'

import './SimpleText.scss'

interface Props extends UseModelProps<string> {
  ctrl: UCSimpleText
  readonly?: boolean
  disabled?: boolean
}

export function SimpleText({
  name,
  value,
  onChange,
  readonly,
  disabled,
  ctrl,
}: Props): JSX.Element {
  return (
    <div className="user-control uc-simple-text d-flex align-items-center">
      <div className="prefix">
        {ctrl?.props?.prefix && <MarkdownWithScript source={ctrl.props.prefix} />}
      </div>
      {readonly ? (
        <strong>
          &nbsp;
          {value}
          &nbsp;
        </strong>
      ) : (
        <Input
          name={name}
          type="text"
          disabled={disabled}
          className="form-control col-4 mx-1"
          value={value}
          onChange={onChange}
        />
      )}
      <div className="postfix">
        {ctrl?.props?.postfix && <MarkdownWithScript source={ctrl.props.postfix} />}
      </div>
    </div>
  )
}
