import React from 'react'
import { useModel, UseModelProps } from 'client/generic/hooks/model'
import { UCFractionNumber } from 'shared/exercise/types'
import { UserControlNameInput } from '../common/UserControlNameInput'
import { Checkbox } from 'client/generic/components/form/input/Checkbox'
import { FormGroup } from 'client/generic/components/form/FormGroup'
import { TextEditor } from 'client/generic/components/form/input/TextEditor'
import { MarkdownWithScript } from '../../../../script/components/MarkdownWithCode'
import { NumberInput } from 'client/generic/components/form/input/NumberInput'
import { CodeExample } from 'client/generic/components/CodeExample'
import { UserControlsPreview } from '../UserControlPreview'

export function FractionNumberAdmin(bindProps: UseModelProps<UCFractionNumber>): JSX.Element {
  const { data, bind } = useModel<UCFractionNumber>(bindProps)

  return (
    <div className="user-control uc-fraction-number uc-fraction-number-admin">
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

      <h6>Megoldás</h6>
      {data.isDynamic && (
        <UserControlsPreview ctrl={data}>
          <div>
            Definiáld a megoldásfüggvényt! Minta:
            <CodeExample>
              {`
(def fraction 23/1234)
(def solution-${data.name} (const fraction))
`}
            </CodeExample>
          </div>
        </UserControlsPreview>
      )}
      {!data.isDynamic && (
        <div>
          <FormGroup label="Számláló">
            {(id) => (
              <NumberInput
                {...bind('solution.numerator')}
                id={id}
                step={1}
                required
                className="form-control form-control-sm"
              />
            )}
          </FormGroup>

          <FormGroup label="Nevező">
            {(id) => (
              <NumberInput
                className="form-control form-control-sm"
                {...bind('solution.denominator')}
                id={id}
                step={1}
                min={0}
                required
              />
            )}
          </FormGroup>
        </div>
      )}
    </div>
  )
}
