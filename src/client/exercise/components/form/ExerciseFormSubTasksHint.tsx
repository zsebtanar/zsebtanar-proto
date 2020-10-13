import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faArrowsAlt } from '@fortawesome/free-solid-svg-icons'
import { UseModelProps } from 'client/generic/hooks/model'
import { Button } from 'client/generic/components/Button'
import { TextEditor } from 'client/generic/components/form/input/TextEditor'
import { MarkdownWithScript } from 'client/script/components/MarkdownWithCode'

import './ExerciseFormSubTasksHint.scss'

interface Props extends UseModelProps<string> {
  index: number
  onRemove: (idx: number) => void
}

export function ExerciseFormSubTasksHint({ index, onRemove, ...bindProps }: Props): JSX.Element {
  return (
    <div className="form-group exercise-task-hints" key={name}>
      <div>
        <label htmlFor={`exercise-subtask-${name}-hint-${name}`}>{index + 1}. segítség</label>
        <div className="btn btn-link move-btn">
          <FontAwesomeIcon icon={faArrowsAlt} /> Mozgatás
        </div>
        <Button small btn="link" className="text-danger" onAction={() => onRemove(index)}>
          <FontAwesomeIcon icon={faTrashAlt} /> Segítség törtlése
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
