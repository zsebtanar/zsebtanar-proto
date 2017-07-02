import React from 'react'
import {SINGLE_CHOICE, SINGLE_NUMBER} from './controlTypes'
import SingleChoiceAdmin from './singleChoice/SingleChoiceAdmin'
import SingleNumberAdmin from './singleNumber/SingleNumberAdmin'

export default function UserControlsAdmin({controlType, controlProps}) {
  switch (controlType) {
    case SINGLE_CHOICE:
      return <SingleChoiceAdmin {...controlProps}/>
    case SINGLE_NUMBER:
      return <SingleNumberAdmin {...controlProps}/>
    default:
      return <div className="alert alert-danger">Not implemented Admin control type "{controlType}"</div>
  }
}