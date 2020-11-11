import React from 'react'
import { Move as MoveIcon, Trash2 as TrashIcon } from 'react-feather'
import { UseModelProps } from 'client/generic/hooks/model'
import { Button } from 'client/generic/components/Button'
import { TextEditor } from 'client/generic/components/form/input/TextEditor'
import { MarkdownWithScript } from 'client/script/components/MarkdownWithCode'
import { Icon } from 'client/generic/components/icons/Icon'

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
          <Icon icon={MoveIcon} /> Mozgatás
        </div>
        <Button small btn="link" className="text-danger" onAction={() => onRemove(index)}>
          <Icon icon={TrashIcon} /> Segítség törtlése
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
