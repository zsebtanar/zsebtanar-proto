import React from 'react'
import SingleChoiceAdmin from './singleChoice/SingleChoiceAdmin'
import {SINGLE_CHOICE} from './controlTypes'

export default function UserControlsAdmin({controlType, controlProps}) {
  switch (controlType) {
    case SINGLE_CHOICE:
      return <SingleChoiceAdmin {...controlProps}/>
    default:
      return <div className="alert alert-danger">Not implemented Admin control type "{controlType}"</div>
  }
}