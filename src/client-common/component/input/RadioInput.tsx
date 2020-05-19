import * as React from 'react'
import { Markdown } from 'client-common/component/general/Markdown'

interface RadioInputProps extends React.InputHTMLAttributes<any> {
  id: string
  name: string
  label: MarkdownString
  resources: MarkdownResources
}

export function RadioInput(props: RadioInputProps) {
  return (
    <div className="custom-control custom-radio d-block">
      <input {...props} type="radio" className="custom-control-input" id={props.id} />
      <label className="custom-control-label" htmlFor={props.id}>
        <Markdown source={props.label} resources={props.resources} />
      </label>
    </div>
  )
}
