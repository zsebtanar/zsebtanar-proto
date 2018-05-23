import React from 'react'
import { Markdown } from 'shared/component/general/Markdown'
import { assoc } from 'ramda'

export function FractionNumber(props) {
  const setSolution = e => {
    if (props.onChange) {
      const { name, value } = e.currentTarget
      props.onChange({
        name: props.name,
        value: assoc(name, value, props.value)
      })
    }
  }

  return (
    <div className="user-control fraction-number d-flex align-items-center">
      <span className="prefix">
        <Markdown source={props.prefix} resources={props.resources} />
      </span>
      {props.readOnly ? (
        <div className="mx-2 text-center">
          <strong>&nbsp;{props.value !== undefined ? props.value.numerator : undefined}&nbsp;</strong>
          <hr className="my-1" />
          <strong>&nbsp;{props.value !== undefined ? props.value.denominator : undefined}&nbsp;</strong>
        </div>
      ) : (
        <div className="input-row">
          <input
            name="numerator"
            type="number"
            className="form-control"
            value={props.value !== undefined ? props.value.numerator : undefined}
            onChange={setSolution}
            step="1"
            placeholder="számláló"
          />
          <hr className="my-1" />
          <input
            name="denominator"
            type="number"
            className="form-control"
            value={props.value !== undefined ? props.value.denominator : undefined}
            onChange={setSolution}
            step="1"
            placeholder="nevező"
          />
        </div>
      )}
      <span className="postfix">
        <Markdown source={props.postfix} resources={props.resources} />
      </span>
    </div>
  )
}
