import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { UseModelProps } from 'client/generic/hooks/model'
import { Button } from 'client/generic/components/Button'
import { TextEditor } from 'client/generic/components/form/input/TextEditor'
import { MarkdownWithScript } from 'client/script/components/MarkdownWithCode'

interface Props extends UseModelProps<string> {
  index: number
  onRemove: (idx: number) => void
}

export function ExerciseFormSubTasksHint({ index, onRemove, ...bindProps }: Props): JSX.Element {
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
