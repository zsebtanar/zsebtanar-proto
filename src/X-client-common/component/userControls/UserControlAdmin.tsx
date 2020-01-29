import * as React from 'react'
import * as t from './controlTypes'
import { SimpleTextAdmin } from './simpleText/SimpleTextAdmin'
import { SingleChoiceAdmin } from './singleChoice/SingleChoiceAdmin'
import { SingleNumberAdmin } from './singleNumber/SingleNumberAdmin'
import { BinaryChoiceAdmin } from './binaryChoice/BinaryChoiceAdmin'
import { MultiChoiceAdmin } from './multiChoice/MultiChoiceAdmin'
import { FractionNumberAdmin } from './fractionNumber/FractionNumberAdmin'
import { NumberListAdmin } from './numberList/NumberListAdmin'

export function UserControlsAdmin({ controlType, controlProps, resources }) {
  switch (controlType) {
    case t.SIMPLE_TEXT:
      return <SimpleTextAdmin {...controlProps} resources={resources} />
    case t.SINGLE_NUMBER:
      return <SingleNumberAdmin {...controlProps} resources={resources} />
    case t.FRACTION_NUMBER:
      return <FractionNumberAdmin {...controlProps} resources={resources} />
    case t.NUMBER_LIST:
      return <NumberListAdmin {...controlProps} resources={resources} />
    case t.SINGLE_CHOICE:
      return <SingleChoiceAdmin {...controlProps} resources={resources} />
    case t.BINARY_CHOICE:
      return <BinaryChoiceAdmin {...controlProps} resources={resources} />
    case t.MULTI_CHOICE:
      return <MultiChoiceAdmin {...controlProps} resources={resources} />
    default:
      return (
        <div className="alert alert-danger">Not implemented Admin control type "{controlType}"</div>
      )
  }
}
