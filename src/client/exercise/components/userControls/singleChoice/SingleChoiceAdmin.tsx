import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { UCSingleChoice } from 'shared/exercise/types'
import { Button, Checkbox, RadioInput, TextEditor } from 'client/generic/components'
import { useModel, UseModelProps } from 'client/generic/hooks/model'
import { UserControlNameInput } from '../common/UserControlNameInput'

export function SingleChoiceAdmin(bindProps: UseModelProps<UCSingleChoice>) {
  const { data, bind, remove, append } = useModel<UCSingleChoice>(bindProps)

  return (
    <div className="user-control simple-text simple-text-admin">
      <UserControlNameInput {...bind('name')} />

      <div>
        <Checkbox {...bind('isDynamic')}>Dinamikus</Checkbox>
      </div>

      <hr />

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
          <li key={idx}>
            <div className="d-flex">
              <RadioInput inputValue={idx} {...bind(`solution`)} className="form-control mt-1" />
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
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
