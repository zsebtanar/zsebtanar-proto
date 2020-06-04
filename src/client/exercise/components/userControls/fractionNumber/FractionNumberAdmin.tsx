import React from 'react'
import { useModel, UseModelProps } from '../../../../generic/hooks/model'
import { UCFractionNumber } from 'shared/exercise/types'
import { Checkbox, Input, TextEditor } from '../../../../generic/components/form'
import { FormGroup } from '../../../../generic/components'
import { MarkdownWithScript } from '../../../../script/components'
import { UserControlNameInput } from '../common/UserControlNameInput'

export function FractionNumberAdmin(bindProps: UseModelProps<UCFractionNumber>) {
  const { bind } = useModel<UCFractionNumber>(bindProps)

  return (
    <div className="user-control uc-fraction-number uc-fraction-number-admin">
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

      <h6>Megoldás</h6>

      <FormGroup label="Számláló">
        {id => (
          <Input
            type="number"
            {...bind('solution.numerator')}
            id={id}
            step={1}
            required
            className="form-control form-control-sm"
          />
        )}
      </FormGroup>

      <FormGroup label="Nevező">
        {id => (
          <Input
            type="number"
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
  )
}
