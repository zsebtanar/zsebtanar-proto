import React from 'react'
import * as dp from 'dot-prop-immutable'
import {
  TextEditor,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  Button
} from '../../../generic/components'
import { MarkdownWithScript } from '../../../script/components'
import { FormCard } from '../../../generic/components/form/FormCard'
import { ExerciseSubTask } from 'shared/exercise/types'
import { useModel, UseModelProps } from '../../../generic/hooks/model'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { NAMES as userControlNames } from '../userControls/controlTypes'
import { UserControlEditModal } from '../../modals/UserControlEditModal'
import { useOverlayDispatch } from '../../../overlay/providers'
import { ExerciseFormSubTasksHint } from './ExerciseFormSubTasksHint'

export function ExerciseFormSubTask({ name, value, onChange }: UseModelProps<ExerciseSubTask>) {
  const { openModal } = useOverlayDispatch()
  const { bind, append, remove, set } = useModel<ExerciseSubTask>({ value, onChange, name })

  const createUserControl = type =>
    openModal(<UserControlEditModal value={{ type } as never} />).then(
      newControl => newControl && append('controls', newControl)
    )

  const editUserControl = (data, idx) =>
    openModal(<UserControlEditModal value={data} />).then(
      control => control && set(model => dp.set(model, `controls.${idx}`, control))
    )

  return (
    <FormCard className="card my-3">
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
                onClick={() => createUserControl(key)}
              >
                {label}
              </button>
            ))}
          </DropdownMenu>
        </Dropdown>
        <ul>
          {value.controls?.map((control, idx) => (
            <li key={idx}>
              <Button small btn="link" onAction={() => editUserControl(control, idx)}>
                <FontAwesomeIcon icon={faEdit} />
              </Button>
              <Button
                small
                btn="link"
                className="text-danger"
                onAction={() => remove(`controls.${idx}`)}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </Button>
              {control.type}
            </li>
          ))}
        </ul>
      </h6>{' '}
      <hr />
      <h6>
        Segítségek{' '}
        <Button small btn="link" onAction={() => append(`hints`, '')}>
          <FontAwesomeIcon icon={faPlusCircle} /> Segítség hozzáadása
        </Button>
      </h6>
      {value.hints?.map((hint, hintIdx) => (
        <ExerciseFormSubTasksHint index={hintIdx} key={hintIdx} {...bind(`hints.${hintIdx}`)} />
      ))}
    </FormCard>
  )
}
