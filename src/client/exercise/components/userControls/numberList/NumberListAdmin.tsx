import React from 'react'
import { useModel, UseModelProps } from '../../../../generic/hooks/model'
import { UCNumberList } from 'shared/exercise/types'
import { Checkbox, Input, TextEditor } from '../../../../generic/components/form'
import { FormGroup, Button } from '../../../../generic/components'
import { MarkdownWithScript } from '../../../../script/components'
import { UserControlNameInput } from '../common/UserControlNameInput'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

export function NumberListAdmin(bindProps: UseModelProps<UCNumberList>) {
  const { bind, data, append, remove } = useModel<UCNumberList>(bindProps)

  return (
    <div className="user-control uc-number-list uc-number-list-admin">
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

      <FormGroup label="Pontosság">
        {id => (
          <>
            <Input
              type="number"
              {...bind('props.fractionDigits')}
              id={id}
              step={1}
              min={0}
              max={10}
              required
              aria-describedby="max-fraction-digits-desc"
              className="form-control form-control-sm"
            />
            <small id="max-fraction-digits-desc" className="text-muted">
              Maximális tizedes jegyek száma
            </small>
          </>
        )}
      </FormGroup>

      <div>
        <Checkbox {...bind('props.acceptRandomOrder')} disabled>
          Megoldások elfogadása tetszőleges sorrendben
        </Checkbox>
      </div>
      <div>
        <Checkbox {...bind('props.multiLine')} disabled>
          Minden mező külön sorban jelenjen meg
        </Checkbox>
      </div>
      <hr />
      <h6>
        Megoldások{' '}
        <Button
          btn="link"
          small
          onAction={() => {
            append('props.fields', {})
            append('solution', '')
          }}
        >
          <FontAwesomeIcon icon={faPlusCircle} /> Alternatív megoldás megadása
        </Button>
      </h6>

      <ol>
        {data.solution?.map((item, idx) => (
          <li key={idx}>
            <div className="d-flex">
              <TextEditor
                {...bind(`props.fields.${idx}.prefix`)}
                preview={MarkdownWithScript}
                resources={{}}
              />
              <TextEditor
                {...bind(`props.fields.${idx}.postfix`)}
                preview={MarkdownWithScript}
                resources={{}}
              />
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
                onAction={() => {
                  remove(`props.fields.${idx}`)
                  remove(`solution.${idx}`)
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
