import React from 'react'
import * as dp from 'dot-prop-immutable'
import { noop } from 'shared/utils/fn'
import { ExerciseSubTask } from 'shared/exercise/types'
import { useModel, UseModelProps } from 'client/generic/hooks/model'
import { PlusCircle as PlusCircleIcon, Edit as EditIcon, Trash2 as TrashIcon } from 'react-feather'
import { NAMES as userControlNames } from '../userControls/controlTypes'
import { UserControlEditModal } from '../../modals/UserControlEditModal'
import { ExerciseFormSubTasksHint } from './ExerciseFormSubTasksHint'
import { UserControls } from '../userControls/UserControl'
import { usePocketLisp } from 'client/script/providers/PocketLispProvider'
import { useOverlayDispatch } from 'client/overlay/providers/OverlayProvider'
import { FormCard } from 'client/generic/components/form/FormCard'
import { Dropdown } from 'client/generic/components/dropdown/Dropdown'
import { DropdownToggle } from 'client/generic/components/dropdown/DropdownToggle'
import { DropdownMenu } from 'client/generic/components/dropdown/DropdownMenu'
import { Button } from 'client/generic/components/Button'
import { TextEditor } from 'client/generic/components/form/input/TextEditor'
import { MarkdownWithScript } from 'client/script/components/MarkdownWithCode'
import { SortableList } from '../../../generic/components/SortableList'
import { Icon } from 'client/generic/components/icons/Icon'

import './ExerciseFormSubTasks.scss'

interface Props extends UseModelProps<ExerciseSubTask> {
  index: number
  onRemove: (idx: number) => void
}

export function ExerciseFormSubTask({ index, onRemove, ...bindProps }: Props): JSX.Element {
  const { evalPL, script } = usePocketLisp()
  const { openModal } = useOverlayDispatch()
  const { bind, append, remove, set, data: subTaskData } = useModel<ExerciseSubTask>({
    ...bindProps,
  })

  const createUserControl = (type) =>
    openModal(<UserControlEditModal scriptSource={script} value={{ type } as never} />, true).then(
      (newControl) => newControl && append('controls', newControl),
    )

  const editUserControl = (data, idx) =>
    openModal(<UserControlEditModal scriptSource={script} value={data} />, true).then(
      (control) => control && set((model) => dp.set(model, `controls.${idx}`, control)),
    )

  return (
    <FormCard className="card my-3">
      <div>
        <h5>
          {index + 1}. Részfeladat
          {' - '}
          <Dropdown elementType="div" className="d-inline-block">
            <DropdownToggle className="btn btn-link btn-sm">
              <Icon icon={PlusCircleIcon} /> Mező hozzáadása
            </DropdownToggle>
            <DropdownMenu>
              {Object.entries(userControlNames).map(([type, label]) => (
                <button
                  key={type}
                  type="button"
                  className="dropdown-item"
                  onClick={() => createUserControl(type)}
                >
                  {label}
                </button>
              ))}
            </DropdownMenu>
          </Dropdown>{' '}
          <Button small btn="link" onAction={() => append(`hints`, '')}>
            <Icon icon={PlusCircleIcon} /> Segítség hozzáadása
          </Button>{' '}
          <Button small btn="link" className="text-danger" onAction={() => onRemove(index)}>
            <Icon icon={TrashIcon} /> Részfeladat törlése
          </Button>
        </h5>
      </div>
      <div className="form-group">
        <TextEditor {...bind(`description`)} preview={MarkdownWithScript} />
      </div>
      <hr />
      <ul className="list-unstyled user-control-list">
        {subTaskData.controls?.map((control, idx) => (
          <li key={idx}>
            <UserControls
              ctrl={control}
              disabled={true}
              onChange={noop}
              name={control.name}
              value={control.isDynamic ? evalPL(`(solution-${control.name})`) : control.solution}
            />
            <div className="uc-controls">
              <span className="badge badge-secondary">{userControlNames[control.type]}</span>
              <Button small btn="link" onAction={() => editUserControl(control, idx)}>
                <Icon icon={EditIcon} />
              </Button>
              <Button
                small
                btn="link"
                className="text-danger"
                onAction={() => remove(`controls.${idx}`)}
              >
                <Icon icon={TrashIcon} />
              </Button>
            </div>
          </li>
        ))}
      </ul>
      {!!subTaskData.hints.length && <hr />}
      {!!subTaskData.hints.length && (
        <SortableList<string> {...bind(`hints`)}>
          {({ key, index }) => (
            <ExerciseFormSubTasksHint
              key={key}
              index={index}
              onRemove={() => remove(`hints.${index}`)}
              {...bind(`hints.${index}`)}
            />
          )}
        </SortableList>
      )}
    </FormCard>
  )
}
