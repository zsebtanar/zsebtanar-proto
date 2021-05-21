import React from 'react'
import { useModel, UseModelProps } from 'client/generic/hooks/model'
import { UCSingleNumber } from 'shared/exercise/types'
import { UserControlNameInput } from '../common/UserControlNameInput'
import { MarkdownWithScript } from 'client/script/components/MarkdownWithCode'
import { Checkbox } from 'client/generic/components/form/input/Checkbox'
import { FormGroup } from 'client/generic/components/form/FormGroup'
import { TextEditor } from 'client/generic/components/form/input/TextEditor'
import { NumberInput } from 'client/generic/components/form/input/NumberInput'

export function SingleNumberAdmin(bindProps: UseModelProps<UCSingleNumber>): JSX.Element {
  const { bind, data } = useModel<UCSingleNumber>(bindProps)

  return (
    <div className="user-control uc-simple-number uc-simple-number-admin">
      <UserControlNameInput {...bind('name')} />
      <div>
        <Checkbox {...bind('isDynamic')}>Dinamikus</Checkbox>
      </div>

      <hr />

      <FormGroup label="Előtag">
        {(id) => <TextEditor {...bind('props.prefix')} id={id} preview={MarkdownWithScript} />}
      </FormGroup>
      <FormGroup label="Utótag">
        {(id) => <TextEditor {...bind('props.postfix')} id={id} preview={MarkdownWithScript} />}
      </FormGroup>

      <hr />

      <FormGroup label="Pontosság">
        {(id) => (
          <>
            <NumberInput
              {...bind('props.fractionDigits')}
              id={id}
              step={1}
              min={0}
              max={10}
              required
              defaultValue={0}
              aria-describedby="max-fraction-digits-desc"
              className="form-control form-control-sm"
            />
            <small id="max-fraction-digits-desc" className="text-muted">
              Maximális tizedes jegyek száma
            </small>
          </>
        )}
      </FormGroup>

      <FormGroup label="Megoldás">
        {(id) =>
          data.isDynamic ? (
            <div className="form-control-plaintext">
              Definiáld a megoldás függvényt:
              <code>(def solution-{data.name} #(...))</code>
            </div>
          ) : (
            <NumberInput
              {...bind('solution')}
              id={id}
              step={1 / Math.pow(10, data.props?.fractionDigits ?? 0)}
              min={0}
              required
              className="form-control form-control-sm"
            />
          )
        }
      </FormGroup>
    </div>
  )
}
