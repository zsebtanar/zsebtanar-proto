import React from 'react'
import * as dp from 'dot-prop-immutable'
import {
  TextEditor,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  Button,
  FormCard
} from 'client/generic/components'
import { MarkdownWithScript } from 'client/script/components'
import { ExerciseSubTask } from 'shared/exercise/types'
import { useModel, UseModelProps } from 'client/generic/hooks/model'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { NAMES as userControlNames } from '../userControls/controlTypes'
import { UserControlEditModal } from '../../modals/UserControlEditModal'
import { useOverlayDispatch } from 'client/overlay/providers'
import { ExerciseFormSubTasksHint } from './ExerciseFormSubTasksHint'
import { UserControls } from '../userControls/UserControl'
import { noop } from 'shared/utils/fn'

interface Props extends UseModelProps<ExerciseSubTask> {
  index: number
  onRemove: (idx: number) => void
}

export function ExerciseFormSubTask({ index, onRemove, ...bindProps }: Props) {
  const { openModal } = useOverlayDispatch()
  const { bind, append, remove, set } = useModel<ExerciseSubTask>(bindProps)

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
      <div>
        <label htmlFor={`exercise-subtask-${name}-hint-${name}`}>{index + 1}. Részfeladat</label>
        <Button small btn="link" className="text-danger" onAction={() => onRemove(index)}>
          <FontAwesomeIcon icon={faTrashAlt} />
        </Button>
      </div>
      <div className="form-group">
        <label htmlFor={`exercise-subtask-${name}-description`}>Leírása</label>
        <TextEditor
          id={`exercise-subtask-${name}-description`}
          {...bind(`description`)}
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
          {bindProps.value.controls?.map((control, idx) => (
            <li key={idx}>
              <UserControls
                ctrl={control}
                readonly
                onChange={noop}
                name=""
                value={control.solution}
              />
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
      {bindProps.value.hints?.map((hint, hintIdx) => (
        <ExerciseFormSubTasksHint
          key={hintIdx}
          index={hintIdx}
          onRemove={() => remove(`hints.${hintIdx}`)}
          {...bind(`hints.${hintIdx}`)}
        />
      ))}
    </FormCard>
  )
}
