import React from 'react'
import { UCBinaryChoice } from 'shared/exercise/types'
import { useModel, UseModelProps } from 'client/generic/hooks/model'
import { UserControlNameInput } from '../common/UserControlNameInput'
import { PlusCircle, Trash2 as TrashIcon } from 'react-feather'
import { Checkbox } from 'client/generic/components/form/input/Checkbox'
import { Button } from 'client/generic/components/Button'
import { TextEditor } from 'client/generic/components/form/input/TextEditor'
import { MarkdownWithScript } from 'client/script/components/MarkdownWithCode'
import { Select } from 'client/generic/components/form/input/Select'
import { Icon } from 'client/generic/components/icons/Icon'
import { Alert } from '../../../../generic/components/Alert'

export function BinaryChoiceAdmin(bindProps: UseModelProps<UCBinaryChoice>): JSX.Element {
  const { bind, data, append, remove } = useModel<UCBinaryChoice>(bindProps)

  return (
    <div className="user-control uc-binary-choice uc-binary-choice-admin">
      <UserControlNameInput {...bind('name')} />
      <div>
        <Checkbox {...bind('isDynamic')} disabled>
          Dinamikus
        </Checkbox>
      </div>

      <hr />

      <div>
        <Checkbox {...bind('props.randomOrder')} disabled>
          Kitöltéskor az állítások véletlenszerű sorredben jelenjenek meg
        </Checkbox>
      </div>

      <hr />

      <h6>
        {' '}
        Megoldások{' '}
        <Button
          btn="link"
          small
          onAction={() => {
            append('props.options', '')
            append('solution', '')
          }}
        >
          <PlusCircle /> Alternatív megoldás megadása
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
              <th className="w-25">Leírás</th>
              <th className="w-25">Igaz állítás</th>
              <th className="w-25">Hamis állítás</th>
              <th>Megoldás</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {data.props?.options?.map((item, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>
                  <TextEditor
                    {...bind(`props.options.${idx}.statement`)}
                    preview={MarkdownWithScript}
                    inline
                  />
                </td>
                <td>
                  <TextEditor
                    {...bind(`props.options.${idx}.trueLabel`)}
                    preview={MarkdownWithScript}
                    inline
                  />
                </td>
                <td>
                  <TextEditor
                    {...bind(`props.options.${idx}.falseLabel`)}
                    preview={MarkdownWithScript}
                    inline
                  />
                </td>
                <td>
                  <Select
                    className="form-control"
                    options={[
                      { label: item.trueLabel, value: true },
                      { label: item.falseLabel, value: false },
                    ]}
                    {...bind(`solution.${idx}`)}
                  />
                </td>
                <td>
                  <Button
                    small
                    btn="link"
                    className="text-danger"
                    onAction={() => {
                      remove(`props.options.${idx}`)
                      remove(`solution.${idx}`)
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
