import React from 'react'
import { PlusCircle as PlusCircleIcon, Trash2 as TrashIcon } from 'react-feather'
import { UCMultiChoice } from 'shared/exercise/types'
import { useModel, UseModelProps } from 'client/generic/hooks/model'
import { UserControlNameInput } from '../common/UserControlNameInput'
import { MarkdownWithScript } from 'client/script/components/MarkdownWithCode'
import { Checkbox } from 'client/generic/components/form/input/Checkbox'
import { Button } from 'client/generic/components/Button'
import { TextEditor } from 'client/generic/components/form/input/TextEditor'
import { Select } from 'client/generic/components/form/input/Select'
import { Icon } from 'client/generic/components/icons/Icon'
import { Alert } from '../../../../generic/components/Alert'

export function MultiChoiceAdmin(bindProps: UseModelProps<UCMultiChoice>): JSX.Element {
  const { data, bind, remove, append } = useModel<UCMultiChoice>(bindProps)

  return (
    <div className="user-control uc-multi-choice uc-multi-choice-admin">
      <UserControlNameInput {...bind('name')} />

      <div>
        <Checkbox {...bind('isDynamic')} disabled>
          Dinamikus
        </Checkbox>
      </div>

      <hr />

      <div className="my-2">
        <Checkbox {...bind('props.randomOrder')}>
          Kitöltéskor az állítások véletlenszerű sorredben jelenjenek meg
        </Checkbox>
      </div>

      <h6>
        Opciók{' '}
        <Button
          btn="link"
          small
          onAction={() => {
            append('props.options', {})
            append('solution', false)
          }}
        >
          <Icon icon={PlusCircleIcon} /> Válasz lehetőség hozzáadása
        </Button>
      </h6>
      {!data.props?.options?.length && (
        <Alert type="warning">Nincs megadva választási lehetőség</Alert>
      )}
      {!!data.props?.options?.length && (
        <table className="table table-borderless table-sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Megoldás</th>
              <th className="w-75">Leírás</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.props?.options?.map((item, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>
                  <Select
                    className="form-control"
                    {...bind('solution')}
                    options={[
                      { label: 'Igaz', value: true },
                      { label: 'Hamis', value: false },
                    ]}
                  />
                </td>
                <td>
                  <TextEditor
                    {...bind(`props.options.${idx}.label`)}
                    preview={MarkdownWithScript}
                    inline
                  />
                </td>
                <td>
                  <Button
                    small
                    btn="link"
                    className="text-danger"
                    onAction={() => {
                      remove(`solution.${idx}`)
                      remove(`props.options.${idx}`)
                    }}
                  >
                    <Icon icon={TrashIcon} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
