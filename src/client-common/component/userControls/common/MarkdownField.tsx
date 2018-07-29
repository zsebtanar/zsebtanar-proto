import * as React from 'react'
import { connect } from 'react-redux'
import { Markdown } from 'client-common/component/general/Markdown'
import { Muted } from 'client-common/component/general/Muted'
import { openInputModal } from 'client-common/store/actions/modal'
import { TrashButton } from './TrashButton'
import { EditButton } from './EditButton'

interface MarkdownFieldProps {
  name: string
  label: string
  value: MDString
  cleanable?: boolean
  onChange?: (event: { name: string; value?: MDString }) => void
  className?: string
  placeholder?: string
  resources: MarkdownResources
}

interface MarkdownFieldDispatchProps {
  openInputModal: typeof openInputModal
}

export const MarkdownField = connect<{}, MarkdownFieldDispatchProps, MarkdownFieldProps>(
  undefined,
  { openInputModal }
)(function(props: MarkdownFieldProps & MarkdownFieldDispatchProps) {
  const { label, value, cleanable, onChange, name, className, placeholder, openInputModal } = props

  const onEdit = () =>
    openInputModal({
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
          {value ? (
            <Markdown source={value} resources={props.resources} />
          ) : (
            <Muted>{placeholder || 'Üres'}</Muted>
          )}
        </div>
      </div>
      <div className="col-3 text-right">
        {value && cleanable === true ? <TrashButton onAction={onClean} /> : ''}
        <EditButton onAction={onEdit} />
      </div>
    </div>
  )
})
