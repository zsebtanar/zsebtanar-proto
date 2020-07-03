import React from 'react'
import { UseModelProps } from 'client/generic/hooks/model'
import { Input } from 'client/generic/components/form/input/Input'
import { FormGroup } from 'client/generic/components/form/FormGroup'

export function UserControlNameInput(bindProps: UseModelProps<string>): JSX.Element {
  return (
    <FormGroup label="Mező neve">
      {(id) => (
        <>
          <Input
            id={id}
            {...bindProps}
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
  )
}
