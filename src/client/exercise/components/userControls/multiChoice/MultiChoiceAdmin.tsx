import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { UCMultiChoice } from 'shared/exercise/types'
import { Button, Checkbox, TextEditor, Select } from 'client/generic/components'
import { useModel, UseModelProps } from 'client/generic/hooks/model'
import { UserControlNameInput } from '../common/UserControlNameInput'

export function MultiChoiceAdmin(bindProps: UseModelProps<UCMultiChoice>) {
  const { data, bind, remove, append } = useModel<UCMultiChoice>(bindProps)

  return (
    <div className="user-control simple-text simple-text-admin">
      <UserControlNameInput {...bind('name')} />

      <div>
        <Checkbox {...bind('isDynamic')}>Dinamikus</Checkbox>
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
            append('solution', false)
          }}
        >
          <FontAwesomeIcon icon={faPlusCircle} /> Válasz lehetőség hozzáadása
        </Button>
      </h6>

      <ol>
        {data.props.options?.map((item, idx) => (
          <li key={idx} className="d-flex">
            <Select
              {...bind('solution')}
              options={[
                { label: 'Igaz', value: true },
                { label: 'Hamis', value: false }
              ]}
            />
            <TextEditor resources={{}} {...bind(`props.options.${idx}.label`)} />
            <Button
              small
              btn="link"
              className="text-danger"
              onAction={() => {
                remove(`solution.${idx}`)
                remove(`props.options.${idx}`)
              }}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </Button>
          </li>
        ))}
      </ol>
    </div>
  )
}
