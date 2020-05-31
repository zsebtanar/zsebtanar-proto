import React from 'react'
import {
  TextEditor,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  Button
} from '../../../generic/components'
import { MarkdownWithScript } from '../../../script/components'
import { ExerciseFormBlock } from '../ExerciseFormBlock'
import { ExerciseSubTask } from 'shared/exercise/types'
import { useModel, OnChange } from '../../../generic/hooks/model'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { NAMES as userControlNames } from '../userControls/controlTypes'
import { UserControlEditModal } from '../../modals/UserControlEditModal'
import { useOverlayDispatch } from '../../../overlay/providers'
import { ExerciseFormSubTaskHint } from './ExerciseFormSubTaskHint'

interface Props {
  name: string
  value: ExerciseSubTask
  onChange: OnChange<ExerciseSubTask>
}

export function ExerciseFormSubTask({ name, value, onChange }: Props) {
  const { openModal } = useOverlayDispatch()
  const { bind, append } = useModel<ExerciseSubTask>(value, name, onChange)

  const editUserControl = (controlType, controlData = {}) =>
    openModal(
      <UserControlEditModal
        name="hello"
        controlType={controlType}
        controlData={controlData as never}
        onChange={() => undefined}
      />
    )

  return (
    <ExerciseFormBlock className="card my-3">
      <div className="form-group">
        <label htmlFor={`exercise-subtask-${name}-description`}>Leírása</label>
        <TextEditor
          id={`exercise-subtask-${name}-description`}
          {...bind(`description`)}
          resources={{}}
          preview={MarkdownWithScript}
        />
      </div>
      <hr />
      <h6>
        Mezők{' '}
        <Dropdown elementType="div" className="d-inline-block">
          <DropdownToggle className="btn-link btn-sm">
            <FontAwesomeIcon icon={faPlusCircle} /> Mező hozzáadása
          </DropdownToggle>
          <DropdownMenu>
            {Object.entries(userControlNames).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className="dropdown-item"
                onClick={() => editUserControl(key)}
              >
                {label}
              </button>
            ))}
          </DropdownMenu>
        </Dropdown>
      </h6>{' '}
      <hr />
      <h6>
        Segítségek{' '}
        <Button small btn="link" onAction={() => append(`hints`, '')}>
          <FontAwesomeIcon icon={faPlusCircle} /> Segítség hozzáadása
        </Button>
      </h6>
      {value.hints?.map((hint, hintIdx) => (
        <ExerciseFormSubTaskHint index={hintIdx} key={hintIdx} {...bind(`hints.${hintIdx}`)} />
      ))}
    </ExerciseFormBlock>
  )
}
