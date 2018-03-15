import * as React from 'react'
import { uid } from 'shared/util/uuid'
import { Markdown } from 'shared/component/general/Markdown'

export default props => (
    <div className="custom-control custom-radio">
      <input
        {...props}
        type="radio"
        className="custom-control-input"
        name={props.name}
        value={props.value}
        checked={props.checked}
        required={props.required}
        onChange={props.onChange}
        id={props.id}
      />
      <label className="custom-control-label" htmlFor={props.id}>
        <Markdown source={props.label} resources={props.resources}/>
      </label>
    </div>
  )