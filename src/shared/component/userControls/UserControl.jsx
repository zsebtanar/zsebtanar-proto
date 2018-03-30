import React from 'react'
import {
  SIMPLE_TEXT,
  SINGLE_CHOICE,
  SINGLE_NUMBER,
  BINARY_CHOICE,
  MULTI_CHOICE, FRACTION_NUMBER
} from './controlTypes'
import { SingleChoice } from './singleChoice/SingleChoice'
import { SingleNumber } from './singleNumber/SingleNumber'
import { SimpleText } from './simpleText/SimpleText'
import { BinaryChoice } from './binaryChoice/BinaryChoice'
import { MultiChoice } from './multiChoice/MultiChoice'
import { FractionNumber } from './fractionNumber/FractionNumber'

export function UserControls({ controlType, controlProps, resources }) {
  switch (controlType) {
    case SIMPLE_TEXT:
      return <SimpleText {...controlProps} resources={resources} />
    case SINGLE_NUMBER:
      return <SingleNumber {...controlProps} resources={resources} />
    case FRACTION_NUMBER:
      return <FractionNumber {...controlProps} resources={resources} />
    case SINGLE_CHOICE:
      return <SingleChoice {...controlProps} resources={resources} />
    case BINARY_CHOICE:
      return <BinaryChoice {...controlProps} resources={resources} />
    case MULTI_CHOICE:
      return <MultiChoice {...controlProps} resources={resources} />
    default:
      return <div className="alert alert-danger">Not implemented control type "{controlType}"</div>
  }
}
