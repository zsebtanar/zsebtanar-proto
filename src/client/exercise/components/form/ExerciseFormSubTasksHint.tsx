import React from 'react'
import { TextEditor, Button } from '../../../generic/components'
import { MarkdownWithScript } from '../../../script/components'
import { ExerciseSubTaskHints } from 'shared/exercise/types'
import { useModel, OnChange } from '../../../generic/hooks/model'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'

interface Props {
  index: number
  name: string
  value: ExerciseSubTaskHints
  onChange: OnChange<ExerciseSubTaskHints>
}

export function ExerciseFormSubTasksHint({ name, value, onChange, index }: Props) {
  const { bind, remove } = useModel<ExerciseSubTaskHints>({ value, name, onChange })

  return (
    <div className="form-group" key={name}>
      <div>
        <label htmlFor={`exercise-subtask-${name}-hint-${name}`}>{index + 1}. segítség</label>
        <Button
          small
          btn="link"
          className="text-danger"
          onAction={() => remove(`subTasks.${name}.hints.${name}`)}
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </Button>
      </div>
      <TextEditor
        id={`exercise-subtask-${name}-hint-${name}`}
        resources={{}}
        preview={MarkdownWithScript}
        {...bind(`subTasks.${name}.hints.${name}`)}
      />
    </div>
  )
}
