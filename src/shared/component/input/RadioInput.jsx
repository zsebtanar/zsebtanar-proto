import * as React from 'react'
import { Markdown } from 'shared/component/general/Markdown'

export default props => {
  return (
    <div className="custom-control custom-radio d-block">
      <input {...props} type="radio" className="custom-control-input" id={props.id}/>
      <label className="custom-control-label" htmlFor={props.id}>
        <Markdown source={props.label} resources={props.resources}/>
      </label>
    </div>
  )
}
