import React from 'react'
import { PlusCircle as PlusCircleIcon, Trash2 as TrashIcon } from 'react-feather'
import { UCMultiChoice } from 'shared/exercise/types'
import { useModel, UseModelProps } from 'client/generic/hooks/model'
import { UserControlNameInput } from '../common/UserControlNameInput'
import { MarkdownWithScript } from 'client/script/components/MarkdownWithCode'
import { Checkbox } from 'client/generic/components/form/input/Checkbox'
import { Button } from 'client/generic/components/Button'
import { TextEditor } from 'client/generic/components/form/input/TextEditor'
import { Select } from 'client/generic/components/form/input/Select'
import { Icon } from 'client/generic/components/icons/Icon'
import { Alert } from '../../../../generic/components/Alert'
import { usePocketLisp } from 'client/script/providers/PocketLispProvider'
import { PLHashMap, PLString, PLVector } from 'pocket-lisp-stdlib'
import { CodeExample } from 'client/generic/components/CodeExample'

export function MultiChoiceAdmin(bindProps: UseModelProps<UCMultiChoice>): JSX.Element {
  const { data, bind, remove, append } = useModel<UCMultiChoice>(bindProps)
  const { evalPL } = usePocketLisp()
  let solution: Map<string, PLString>[] = []
  let hasSolution = false
  const hasName = data.name !== undefined
  if (data.isDynamic) {
    const dynamicSolution = evalPL(`(solution-${data.name})`) as PLVector<PLHashMap<PLString>>
    if (dynamicSolution !== undefined) {
      solution = dynamicSolution.value.map((x) => x.toJS())
      hasSolution = true
    }
  }

  return (
    <div className="user-control uc-multi-choice uc-multi-choice-admin">
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

      <h6>Opciók</h6>
      {data.isDynamic && !hasName && <div>Adj nevet a megoldási mezőnek!</div>}
      {data.isDynamic && hasName && !hasSolution && (
        <div>
          Definiáld a megoldásfüggvényt! Több jó választ is megadhatsz. Minta:
          <CodeExample>
            {`(def x [{"Rossz választás." false},
        {"Ez jó válasz!" true},
        {"Ez is jó válasz!" true},
        {"Ez viszont rossz." false}])
(def solution-`}
            {data.name}
            {` (const x))`}
          </CodeExample>
        </div>
      )}
      {data.isDynamic && hasName && hasSolution && (
        <div>
          {solution.map((item, idx) => (
            <div key={idx}>
              <Checkbox
                {...bind(`${idx}`)}
                checked={item.values().next().value?.toString() === 'true'}
                disabled
              >
                <MarkdownWithScript source={item.keys().next().value} />
              </Checkbox>
            </div>
          ))}
        </div>
      )}
      {!data.isDynamic && (
        <div>
          <Button
            btn="link"
            small
            onAction={() => {
              append('props.options', {})
              append('solution', false)
            }}
          >
            <Icon icon={PlusCircleIcon} /> Válasz lehetőség hozzáadása
          </Button>

          {!data.props?.options?.length && (
            <Alert type="warning">Nincs megadva választási lehetőség</Alert>
          )}
          {!!data.props?.options?.length && (
            <table className="table table-borderless table-sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Megoldás</th>
                  <th className="w-75">Leírás</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.props?.options?.map((item, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <Select
                        className="form-control"
                        {...bind('solution')}
                        options={[
                          { label: 'Igaz', value: true },
                          { label: 'Hamis', value: false },
                        ]}
                      />
                    </td>
                    <td>
                      <TextEditor
                        {...bind(`props.options.${idx}.label`)}
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
                          remove(`solution.${idx}`)
                          remove(`props.options.${idx}`)
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
        </div>
      )}
    </div>
  )
}
