import React from 'react'
import { SIMPLE_TEXT, SINGLE_CHOICE, SINGLE_NUMBER } from './controlTypes'
import SingleChoice from './singleChoice/SingleChoice'
import SingleNumber from './singleNumber/SingleNumber'
import SimpleText from './simpleText/SimpleText'

export default function UserControls ({controlType, controlProps}) {
  switch (controlType) {
    case SIMPLE_TEXT:
      return <SimpleText {...controlProps}/>
    case SINGLE_NUMBER:
      return <SingleNumber {...controlProps}/>
    case SINGLE_CHOICE:
      return <SingleChoice {...controlProps}/>
    default:
      return <div className="alert alert-danger">Not implemented control type "{controlType}"</div>
  }
}
