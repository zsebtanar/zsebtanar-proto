import React from 'react'
import SingleChoice from './singleChoice/SingleChoice'
import {SINGLE_CHOICE} from './controlTypes'

export default function UserControls({controlType, controlProps}) {
  switch (controlType) {
    case SINGLE_CHOICE:
      return <SingleChoice {...controlProps}/>
    default:
      return <div className="alert alert-danger">Not implemented control type "{controlType}"</div>
  }
}