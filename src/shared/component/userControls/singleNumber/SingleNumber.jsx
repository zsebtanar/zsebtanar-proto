import React from 'react'
import { Markdown } from 'shared/component/general/Markdown'
import Icon from '../../general/Icon'

export function SingleNumber(props) {

  const setSolution = e => {
    if (props.onChange) {
      props.onChange({
        name: props.name,
        value: e.currentTarget.value
      })
    }
  }

  return (
    <div className="user-control single-number">
      <div className="d-flex align-items-center">
        <span className="prefix">
          <Markdown source={props.prefix} resources={props.resources} />
        </span>
        {props.readOnly ? (
          <strong>&nbsp;{props.value !== undefined ? props.value : undefined}&nbsp;</strong>
        ) : (
          <input
            name={props.name}
            type="number"
            className="form-control col-4 mx-1"
            onChange={setSolution}
            value={props.value !== undefined ? props.value : undefined}
            step={1 / Math.pow(10, props.fractionDigits || 0)}
          />
        )}
        <span className="postfix">
          <Markdown source={props.postfix} resources={props.resources} />
        </span>
      </div>
      {props.fractionDigits > 0 && (
        <small className="form-text text-warning">
          <Icon fa="exclamation-triangle"/> Kérlek, {props.fractionDigits} tizedesjegy pontossággal add meg a megoldást.
        </small>
      )}
    </div>
  )
}
