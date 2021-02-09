import { useClassification } from '../provider/ClassificationProvider'
import { MultiSelectCombobox } from '../../generic/components/MultiSelectCombobox'
import React from 'react'
import { UseModelProps } from '../../generic/hooks/model'

export interface Props extends UseModelProps<string[]> {}

export function ClassificationComboBox({ name, value, onChange }: Props): null | JSX.Element {
  const classifications = useClassification()

  if (!classifications.isSuccess) {
    return null
  }

  return (
    <MultiSelectCombobox
      label="Címkék"
      options={(classifications?.result?.list ?? []).map(({ id, label }) => ({
        value: id ?? '',
        label,
      }))}
      name={name}
      value={value}
      onChange={onChange}
      itemRenderer={({ label, value }) => (
        <div>
          <span className="badge badge-info">{value.split('|')[1]}</span> {label}
        </div>
      )}
    />
  )
}
