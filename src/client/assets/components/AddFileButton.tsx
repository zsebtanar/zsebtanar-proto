import React from 'react'
import { UseModelProps } from '../../generic/hooks/model'
import { clipboardToFile } from '../utils/file'

interface Props extends UseModelProps<File[]> {}

export function AddFileButton({ onChange, name }: Props) {
  const fileSelect = event => {
    let files: File[] = []
    if (event.dataTransfer) {
      files = event.dataTransfer.files
    } else if (event.clipboardData) {
      files = clipboardToFile(event.clipboardData.items)
    } else {
      files = event.currentTarget.files
    }
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
