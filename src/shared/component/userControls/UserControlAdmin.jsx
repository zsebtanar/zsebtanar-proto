import React from 'react'
import {
  SIMPLE_TEXT,
  SINGLE_CHOICE,
  SINGLE_NUMBER,
  BINARY_CHOICE,
  MULTI_CHOICE, FRACTION_NUMBER
} from './controlTypes'
import { SimpleTextAdmin } from './simpleText/SimpleTextAdmin'
import { SingleChoiceAdmin } from './singleChoice/SingleChoiceAdmin'
import { SingleNumberAdmin } from './singleNumber/SingleNumberAdmin'
import { BinaryChoiceAdmin } from './binaryChoice/BinaryChoiceAdmin'
import { MultiChoiceAdmin } from './multiChoice/MultiChoiceAdmin'
import { FractionNumberAdmin } from './fractionNumber/FractionNumberAdmin'

export function UserControlsAdmin({ controlType, controlProps, resources }) {
  switch (controlType) {
    case SIMPLE_TEXT:
      return <SimpleTextAdmin {...controlProps} resources={resources} />
    case SINGLE_NUMBER:
      return <SingleNumberAdmin {...controlProps} resources={resources} />
    case FRACTION_NUMBER:
      return <FractionNumberAdmin {...controlProps} resources={resources} />
    case SINGLE_CHOICE:
      return <SingleChoiceAdmin {...controlProps} resources={resources} />
    case BINARY_CHOICE:
      return <BinaryChoiceAdmin {...controlProps} resources={resources} />
    case MULTI_CHOICE:
      return <MultiChoiceAdmin {...controlProps} resources={resources} />
    default:
      return (
        <div className="alert alert-danger">Not implemented Admin control type "{controlType}"</div>
      )
  }
}
