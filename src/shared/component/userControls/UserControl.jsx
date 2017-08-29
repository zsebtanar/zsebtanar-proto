import React from 'react'
import { SIMPLE_TEXT, SINGLE_CHOICE, SINGLE_NUMBER, BINARY_CHOICE, MULTI_CHOICE } from './controlTypes'
import SingleChoice from './singleChoice/SingleChoice'
import SingleNumber from './singleNumber/SingleNumber'
import SimpleText from './simpleText/SimpleText'
import BinaryChoice from './binaryChoice/BinaryChoice'
import MultiChoice from './multiChoice/MultiChoice'

export default function UserControls ({controlType, controlProps}) {
  switch (controlType) {
    case SIMPLE_TEXT:
      return <SimpleText {...controlProps}/>
    case SINGLE_NUMBER:
      return <SingleNumber {...controlProps}/>
    case SINGLE_CHOICE:
      return <SingleChoice {...controlProps}/>
    case BINARY_CHOICE:
      return <BinaryChoice {...controlProps}/>
    case MULTI_CHOICE:
      return <MultiChoice {...controlProps}/>
    default:
      return <div className="alert alert-danger">Not implemented control type "{controlType}"</div>
  }
}
