import React from 'react'
import { UseModelProps } from 'client/generic/hooks/model'
import { Markdown, Input } from 'client/generic/components'
import { UCSimpleText } from 'shared/exercise/types'

interface Props extends UseModelProps<string> {
  ctrl: UCSimpleText
  readonly: boolean
}

export function SimpleText({ name, value, onChange, readonly, ctrl }: Props) {
  return (
    <div className="user-control simple-text d-flex align-items-center">
      <span className="prefix">
        {ctrl.props.prefix && <Markdown source={ctrl.props.prefix} resources={{}} />}
      </span>
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
          className="form-control col-4 mx-1"
          value={value}
          onChange={onChange}
        />
      )}
      <span className="postfix">
        {ctrl.props.postfix && <Markdown source={ctrl.props.postfix} resources={{}} />}
      </span>
    </div>
  )
}
