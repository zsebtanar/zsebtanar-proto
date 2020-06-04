import React from 'react'
import { useModel, UseModelProps } from '../../../../generic/hooks/model'
import { UCSimpleText } from 'shared/exercise/types'
import { Checkbox, Input } from '../../../../generic/components/form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { Button, FormGroup } from '../../../../generic/components'
import { TextEditor } from '../../../../generic/components/form'
import { MarkdownWithScript } from '../../../../script/components'
import { UserControlNameInput } from '../common/UserControlNameInput'

export function SimpleTextAdmin(bindProps: UseModelProps<UCSimpleText>) {
  const { data, bind, remove, append } = useModel<UCSimpleText>(bindProps)

  return (
    <div className="user-control uc-simple-text uc-simple-text-admin">
      <UserControlNameInput {...bind('name')} />

      <div>
        <Checkbox {...bind('isDynamic')} disabled>
          Dinamikus
        </Checkbox>
      </div>

      <hr />

      <FormGroup label="Előtag">
        {id => (
          <TextEditor
            {...bind('props.prefix')}
            id={id}
            preview={MarkdownWithScript}
            resources={{}}
          />
        )}
      </FormGroup>
      <FormGroup label="Utótag">
        {id => (
          <TextEditor
            {...bind('props.postfix')}
            id={id}
            preview={MarkdownWithScript}
            resources={{}}
          />
        )}
      </FormGroup>
      <hr />

      <div>
        <Checkbox {...bind('props.ignoreSpaces')}>Szóközök figyelmen kívül hagyása</Checkbox>
      </div>
      <div className="my-2">
        <Checkbox {...bind('props.caseSensitive')}>Kis- és nagybetűk megkülönböztetése</Checkbox>
      </div>

      <FormGroup
        label={
          <>
            Megoldások{' '}
            <Button btn="link" small onAction={() => append('solution', '')}>
              <FontAwesomeIcon icon={faPlusCircle} /> Alternatív megoldás megadása
            </Button>
          </>
        }
      >
        {() => (
          <ol>
            {data.solution?.map((item, idx) => (
              <li key={idx}>
                <div className="d-flex">
                  <Input
                    {...bind(`solution.${idx}`)}
                    type="text"
                    className="form-control mt-1"
                    required
                  />
                  <Button
                    small
                    btn="link"
                    className="text-danger"
                    onAction={() => remove(`solution.${idx}`)}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </Button>
                </div>
              </li>
            ))}
          </ol>
        )}
      </FormGroup>
    </div>
  )
}
