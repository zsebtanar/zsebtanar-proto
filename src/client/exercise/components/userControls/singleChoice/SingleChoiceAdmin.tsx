import React from 'react'
import { PlusCircle as PlusCircleIcon, Trash2 as TrashIcon } from 'react-feather'
import { UCSingleChoice } from 'shared/exercise/types'
import { useModel, UseModelProps } from 'client/generic/hooks/model'
import { UserControlNameInput } from '../common/UserControlNameInput'
import { MarkdownWithScript } from 'client/script/components/MarkdownWithCode'
import { Checkbox } from 'client/generic/components/form/input/Checkbox'
import { Button } from 'client/generic/components/Button'
import { RadioInput } from 'client/generic/components/form/input/RadioInput'
import { TextEditor } from 'client/generic/components/form/input/TextEditor'
import { Icon } from 'client/generic/components/icons/Icon'

export function SingleChoiceAdmin(bindProps: UseModelProps<UCSingleChoice>): JSX.Element {
  const { data, bind, remove, append } = useModel<UCSingleChoice>(bindProps)
  console.log(data)
  return (
    <div className="user-control uc-simple-text uc-simple-text-admin">
      <UserControlNameInput {...bind('name')} />

      <div>
        <Checkbox {...bind('isDynamic')} disabled>
          Dinamikus
        </Checkbox>
      </div>

      <hr />

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

      <ol>
        {data.props?.options?.map((item, idx) => (
          <li key={idx}>
            <div className="d-flex">
              <RadioInput inputValue={idx} {...bind(`solution`)} className="mt-1" />
              <TextEditor {...bind(`props.options.${idx}.label`)} preview={MarkdownWithScript} />
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
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
