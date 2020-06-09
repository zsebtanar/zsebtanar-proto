import React from 'react'
import { TextEditor, Button } from '../../../generic/components'
import { MarkdownWithScript } from '../../../script/components'
import { UseModelProps } from '../../../generic/hooks/model'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'

interface Props extends UseModelProps<string> {
  index: number
  onRemove: (idx: number) => void
}

export function ExerciseFormSubTasksHint({ index, onRemove, ...bindProps }: Props) {
  return (
    <div className="form-group" key={name}>
      <div>
        <label htmlFor={`exercise-subtask-${name}-hint-${name}`}>{index + 1}. segítség</label>
        <Button small btn="link" className="text-danger" onAction={() => onRemove(index)}>
          <FontAwesomeIcon icon={faTrashAlt} />
        </Button>
      </div>
      <TextEditor
        id={`exercise-subtask-${name}-hint-${name}`}
        preview={MarkdownWithScript}
        {...bindProps}
      />
    </div>
  )
}
