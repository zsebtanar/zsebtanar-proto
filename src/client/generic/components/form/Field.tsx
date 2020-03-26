import React from 'react'
import { RepresentationType, FieldDefinition } from 'client/generic/types'

interface Props {
  field: FieldDefinition
}

export function Field({ field }: Props) {
  switch (field.representation.type) {
    case RepresentationType.Text:
      return <div>Text</div>
    case RepresentationType.Number:
      return <div>Number</div>
    case RepresentationType.MultilineText:
      return <div>MultilineText</div>
    case RepresentationType.Markdown:
      return <div>Markdown</div>
    case RepresentationType.Date:
      return <div>Date</div>
    case RepresentationType.Time:
      return <div>Time</div>
    case RepresentationType.DateTime:
      return <div>DateTime</div>
    case RepresentationType.Checkbox:
      return <div>Checkbox</div>
    case RepresentationType.RadioButton:
      return <div>RadioButton</div>
    case RepresentationType.Select:
      return <div>Select</div>
  }
}
