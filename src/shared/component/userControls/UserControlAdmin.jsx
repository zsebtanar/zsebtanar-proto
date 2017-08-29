import React from 'react'
import { SIMPLE_TEXT, SINGLE_CHOICE, SINGLE_NUMBER, BINARY_CHOICE } from './controlTypes'
import SimpleTextAdmin from './simpleText/SimpleTextAdmin'
import SingleChoiceAdmin from './singleChoice/SingleChoiceAdmin'
import SingleNumberAdmin from './singleNumber/SingleNumberAdmin'
import BinaryChoiceAdmin from 'shared/component/userControls/binaryChoice/BinaryChoiceAdmin'

export default function UserControlsAdmin ({controlType, controlProps}) {
  switch (controlType) {
    case SIMPLE_TEXT:
      return <SimpleTextAdmin {...controlProps}/>
    case SINGLE_NUMBER:
      return <SingleNumberAdmin {...controlProps}/>
    case SINGLE_CHOICE:
      return <SingleChoiceAdmin {...controlProps}/>
    case BINARY_CHOICE:
      return <BinaryChoiceAdmin {...controlProps}/>
    default:
      return <div className="alert alert-danger">Not implemented Admin control type "{controlType}"</div>
  }
}
