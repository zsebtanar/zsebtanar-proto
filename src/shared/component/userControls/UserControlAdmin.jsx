import React from 'react'
import { SIMPLE_TEXT, SINGLE_CHOICE, SINGLE_NUMBER } from './controlTypes'
import SimpleTextAdmin from './simpleText/SimpleTextAdmin'
import SingleChoiceAdmin from './singleChoice/SingleChoiceAdmin'
import SingleNumberAdmin from './singleNumber/SingleNumberAdmin'

export default function UserControlsAdmin ({controlType, controlProps}) {
  switch (controlType) {
    case SIMPLE_TEXT:
      return <SimpleTextAdmin {...controlProps}/>
    case SINGLE_NUMBER:
      return <SingleNumberAdmin {...controlProps}/>
    case SINGLE_CHOICE:
      return <SingleChoiceAdmin {...controlProps}/>
    default:
      return <div className="alert alert-danger">Not implemented Admin control type "{controlType}"</div>
  }
}
