import * as React from 'react'
import { connect } from 'react-redux'
import { Markdown } from 'shared/component/general/Markdown'
import Muted from 'shared/component/general/Muted'
import { openInputModal } from 'shared/store/actions/modal'
import { TrashButton } from '../common/TrashButton'
import { EditButton } from '../common/EditButton'

export const MarkdownField = connect(undefined, { openInputModal })(props => {
  const { label, value, cleanable, onChange, name, className, placeholder } = props

  const onEdit = () =>
    props.openInputModal({
      title: 'Felirat szerkesztő',
      label: label,
      value: value,
      onUpdate: value => onChange({ name, value })
    })

  const onClean = () => onChange({ name, value: undefined })

  return (
    <div className={`form-group row ${className}`}>
      <label className="col-3 col-form-label">{label}</label>
      <div className="col-6">
        <div className="form-control-static m-2">
          {value ? <Markdown source={value} resources={props.resources} /> : <Muted>{placeholder || 'Üres'}</Muted>}
        </div>
      </div>
      <div className="col-3 text-right">
        {value && cleanable === true ? <TrashButton onAction={onClean} /> : ''}
        <EditButton onAction={onEdit} />
      </div>
    </div>
  )
})
