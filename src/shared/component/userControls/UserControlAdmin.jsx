import React from 'react'
import {
  SIMPLE_TEXT,
  SINGLE_CHOICE,
  SINGLE_NUMBER,
  BINARY_CHOICE,
  MULTI_CHOICE
} from './controlTypes'
import { SimpleTextAdmin } from './simpleText/SimpleTextAdmin'
import { SingleChoiceAdmin } from './singleChoice/SingleChoiceAdmin'
import { SingleNumberAdmin } from './singleNumber/SingleNumberAdmin'
import { BinaryChoiceAdmin } from './binaryChoice/BinaryChoiceAdmin'
import { MultiChoiceAdmin } from './multiChoice/MultiChoiceAdmin'

export default function UserControlsAdmin({ controlType, controlProps }) {
  switch (controlType) {
    case SIMPLE_TEXT:
      return <SimpleTextAdmin {...controlProps} />
    case SINGLE_NUMBER:
      return <SingleNumberAdmin {...controlProps} />
    case SINGLE_CHOICE:
      return <SingleChoiceAdmin {...controlProps} />
    case BINARY_CHOICE:
      return <BinaryChoiceAdmin {...controlProps} />
    case MULTI_CHOICE:
      return <MultiChoiceAdmin {...controlProps} />
    default:
      return (
        <div className="alert alert-danger">Not implemented Admin control type "{controlType}"</div>
      )
  }
}
