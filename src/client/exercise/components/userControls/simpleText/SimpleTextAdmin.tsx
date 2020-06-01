import React from 'react'
import { useModel, UseModelProps } from '../../../../generic/hooks/model'
import { UCSimpleText } from 'shared/exercise/types'
import { Checkbox, Input } from '../../../../generic/components/form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { Button, FormGroup } from '../../../../generic/components'
import { TextEditor } from '../../../../generic/components/form'
import { MarkdownWithScript } from '../../../../script/components'

export function SimpleTextAdmin({ value, onChange, name }: UseModelProps<UCSimpleText>) {
  const { data, bind, remove, append } = useModel<UCSimpleText>({ value, onChange, name })

  return (
    <div className="user-control simple-text simple-text-admin">
      <FormGroup label="Mező neve">
        {id => (
          <>
            <Input
              id={id}
              {...bind('name')}
              required
              pattern="^[a-zA-Z_][\w-]*$"
              aria-describedby="simple-number-name-desc"
              className="form-control form-control-sm"
            />
            <small id="simple-number-name-desc" className="text-muted">
              <ul>
                <li>Egyedi kell legyen a feladaton belül</li>
                <li>Csak betűvel kezdődthet </li>
                <li>Nem tartalmazhat szóköz vagy ékezetes karakter</li>
              </ul>
            </small>
          </>
        )}
      </FormGroup>

      <div>
        <Checkbox {...bind('isDynamic')}>Dinamikus</Checkbox>
      </div>
      <hr />

      <FormGroup label="Előtag">
        {id => (
          <TextEditor {...bind('prefix')} id={id} preview={MarkdownWithScript} resources={{}} />
        )}
      </FormGroup>
      <FormGroup label="Utótag">
        {id => (
          <TextEditor {...bind('postfix')} id={id} preview={MarkdownWithScript} resources={{}} />
        )}
      </FormGroup>
      <hr />

      <div>
        <Checkbox {...bind('ignoreSpaces')}>Szóközök figyelmen kívül hagyása</Checkbox>
      </div>
      <div className="my-2">
        <Checkbox {...bind('caseSensitive')}>Kis- és nagybetűk megkülönböztetése</Checkbox>
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
