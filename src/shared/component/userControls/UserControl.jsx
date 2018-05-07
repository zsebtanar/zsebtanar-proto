import React from 'react'
import * as t from './controlTypes'
import { SingleChoice } from './singleChoice/SingleChoice'
import { SingleNumber } from './singleNumber/SingleNumber'
import { SimpleText } from './simpleText/SimpleText'
import { BinaryChoice } from './binaryChoice/BinaryChoice'
import { MultiChoice } from './multiChoice/MultiChoice'
import { FractionNumber } from './fractionNumber/FractionNumber'
import { NumberList } from './numberList/NumberList'

export function UserControls({ controlType, controlProps, resources }) {
  switch (controlType) {
    case t.SIMPLE_TEXT:
      return <SimpleText {...controlProps} resources={resources} />
    case t.SINGLE_NUMBER:
      return <SingleNumber {...controlProps} resources={resources} />
    case t.FRACTION_NUMBER:
      return <FractionNumber {...controlProps} resources={resources} />
    case t.NUMBER_LIST:
      return <NumberList {...controlProps} resources={resources} />
    case t.SINGLE_CHOICE:
      return <SingleChoice {...controlProps} resources={resources} />
    case t.BINARY_CHOICE:
      return <BinaryChoice {...controlProps} resources={resources} />
    case t.MULTI_CHOICE:
      return <MultiChoice {...controlProps} resources={resources} />
    default:
      return <div className="alert alert-danger">Not implemented control type "{controlType}"</div>
  }
}
