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

      <ol>
        {data.props?.options?.map((item, idx) => (
          <li key={idx} className="d-flex">
            <Select
              {...bind('solution')}
              options={[
                { label: 'Igaz', value: true },
                { label: 'Hamis', value: false },
              ]}
            />
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
          </li>
        ))}
      </ol>
    </div>
  )
}
