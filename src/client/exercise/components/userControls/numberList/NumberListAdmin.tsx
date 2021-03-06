import React from 'react'
import { PlusCircle as PlusCircleIcon, Trash2 as TrashIcon } from 'react-feather'
import { UCNumberList } from 'shared/exercise/types'
import { useModel, UseModelProps } from 'client/generic/hooks/model'
import { UserControlNameInput } from '../common/UserControlNameInput'
import { MarkdownWithScript } from 'client/script/components/MarkdownWithCode'
import { Checkbox } from 'client/generic/components/form/input/Checkbox'
import { FormGroup } from 'client/generic/components/form/FormGroup'
import { TextEditor } from 'client/generic/components/form/input/TextEditor'
import { Button } from 'client/generic/components/Button'
import { NumberInput } from 'client/generic/components/form/input/NumberInput'
import { Icon } from 'client/generic/components/icons/Icon'
import { Alert } from 'client/generic/components/Alert'
import { CodeExample } from 'client/generic/components/CodeExample'
import { UserControlsPreview } from '../UserControlPreview'

export function NumberListAdmin(bindProps: UseModelProps<UCNumberList>): JSX.Element {
  const { bind, data, append, remove } = useModel<UCNumberList>(bindProps)

  return (
    <div className="user-control uc-number-list uc-number-list-admin">
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
              defaultValue={0}
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
      <h6>Szám lista</h6>
      {data.isDynamic && (
        <UserControlsPreview ctrl={data}>
          <div>
            Definiáld a megoldásfüggvényt! Minta:
            <CodeExample>
              {`
(def num-list [0.12 -0.12])
(def solution-${data.name} (const num-list))
(def fields-${data.name} (const [{:prefix "x=" :postfix "m^3"}, {}]))
`}
            </CodeExample>
          </div>
        </UserControlsPreview>
      )}
      {!data.isDynamic && (
        <>
          <Button
            btn="link"
            small
            onAction={() => {
              append('props.fields', {})
              append('solution', '')
            }}
          >
            <Icon icon={PlusCircleIcon} /> Új mező fevétele
          </Button>

          {!data.solution?.length && <Alert type="warning">A szám lista üres</Alert>}
          {data.solution?.length && (
            <table className="table table-borderless table-sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th className="w-25">Előtag</th>
                  <th>Megoldás</th>
                  <th className="w-25">Utótag</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.solution?.map((item, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <TextEditor
                        {...bind(`props.fields.${idx}.prefix`)}
                        preview={MarkdownWithScript}
                        inline
                      />
                    </td>
                    <td>
                      <NumberInput
                        {...bind(`solution.${idx}`)}
                        className="form-control mt-1"
                        required
                      />
                    </td>
                    <td>
                      <TextEditor
                        {...bind(`props.fields.${idx}.postfix`)}
                        preview={MarkdownWithScript}
                        inline
                      />
                    </td>
                    <td>
                      <Button
                        small
                        btn="link"
                        className="text-danger"
                        onAction={() => {
                          remove(`props.fields.${idx}`)
                          remove(`solution.${idx}`)
                        }}
                      >
                        <Icon icon={TrashIcon} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  )
}
