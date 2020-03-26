import React from 'react'
import { Field } from 'client/generic/components/form/Field'
import { FieldDefinition } from 'client/generic/types'
import { FormProvider } from 'client/generic/components/form/FormProvider'
import { func } from 'joi'
import { useForm } from 'client/generic/hooks/form'

interface Props<T> {
  className?: string
  fieldDefs: FieldDefinition[]
}

export function Form<T>({ className, fieldDefs }: Props<T>) {
  return (
    <FormProvider service={} fieldDefs={fieldDefs}>
      <form className={className} onSubmit={}>
        {fields.map(field => (
          <Field key={field.name} field={field} />
        ))}
      </form>
    </FormProvider>
  )
}

function X() {
  const { fields } = useForm<T>(fieldDefs, id, getModel, saveModel)
}
