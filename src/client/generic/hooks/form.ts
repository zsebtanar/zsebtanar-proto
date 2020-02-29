import { useState, useMemo } from 'react'
import * as dp from 'dot-prop-immutable'
import { FieldOnChange, Representation, FormField } from 'client/generic/types'


interface OutputField<T> {
  name: string
  value: T
  representation: Representation
  onChange: FieldOnChange<T>
}

interface Output<T> {
  fields: OutputField<T>[]
  model: T
}

export function useForm<T>(model: T, fieldDef: FormField[]): Output<T> {
  const [modelValue, setValue] = useState<T>(model)

  const fields = useMemo(
    () =>
      fieldDef.map(({ name, defaultValue, representation }) => {
        const value = dp.get(modelValue, name, defaultValue ?? '')
        return {
          name,
          value,
          representation,
          onChange: event => setValue(model => dp.set(model, name, event.value))
        }
      }),
    [fieldDef]
  )

  return {
    fields,
    model: modelValue
  }
}
