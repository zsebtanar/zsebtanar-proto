import React from 'react'
import { UseModelProps } from '../../generic/hooks/model'

interface Props extends UseModelProps<File[]> {}

export function AddFileButton({ onChange, name }: Props) {
  const fileSelect = event => {
    onChange({ name, value: Array.from(event.currentTarget.files) })
  }

  return (
    <div className="input-group add-file-to-exercise">
      <div className="custom-file">
        <input
          type="file"
          name={name}
          className="custom-file-input"
          id="add-file-input"
          onChange={fileSelect}
          accept="image/png, image/jpeg"
        />
        <button className="custom-file-label btn btn-block">Fájl hozzáadása</button>
      </div>
    </div>
  )
}
