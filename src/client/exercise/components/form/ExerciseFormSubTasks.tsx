import React from 'react'
import * as dp from 'dot-prop-immutable'
import { noop } from 'shared/utils/fn'
import { ExerciseSubTask } from 'shared/exercise/types'
import { useModel, UseModelProps } from 'client/generic/hooks/model'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
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

interface Props extends UseModelProps<ExerciseSubTask> {
  index: number
  onRemove: (idx: number) => void
}

export function ExerciseFormSubTask({ index, onRemove, ...bindProps }: Props): JSX.Element {
  const { evalPL, script } = usePocketLisp()
  const { openModal } = useOverlayDispatch()
  const { bind, append, remove, set } = useModel<ExerciseSubTask>(bindProps)

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
          </Dropdown>{' '}
          <Button small btn="link" onAction={() => append(`hints`, '')}>
            <FontAwesomeIcon icon={faPlusCircle} /> Segítség hozzáadása
          </Button>{' '}
          <Button small btn="link" className="text-danger" onAction={() => onRemove(index)}>
            <FontAwesomeIcon icon={faTrashAlt} /> Részfeladat törlése
          </Button>
        </h5>
      </div>
      <div className="form-group">
        <TextEditor {...bind(`description`)} preview={MarkdownWithScript} />
      </div>
      <hr />
      <ul>
        {bindProps.value.controls?.map((control, idx) => (
          <li key={idx}>
            <div className="row">
              <div className="col-10">
                <UserControls
                  ctrl={control}
                  disabled={true}
                  onChange={noop}
                  name={control.name}
                  value={
                    control.isDynamic ? evalPL(`(solution-${control.name})`) : control.solution
                  }
                />
              </div>
              <div className="col-2 text-right">
                <span className="badge badge-secondary">{userControlNames[control.type]}</span>
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
              </div>
            </div>
          </li>
        ))}
      </ul>
      {!!bindProps.value.hints.length && <hr />}
      {!!bindProps.value.hints.length && (
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
