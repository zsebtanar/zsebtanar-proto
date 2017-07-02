import React from 'react'
import {SINGLE_CHOICE, SINGLE_NUMBER} from './controlTypes'
import SingleChoice from './singleChoice/SingleChoice'
import SingleNumber from './singleNumber/SingleNumber'

export default function UserControls({controlType, controlProps}) {
  switch (controlType) {
    case SINGLE_CHOICE:
      return <SingleChoice {...controlProps}/>
    case SINGLE_NUMBER:
      return <SingleNumber {...controlProps}/>
    default:
      return <div className="alert alert-danger">Not implemented control type "{controlType}"</div>
  }
}