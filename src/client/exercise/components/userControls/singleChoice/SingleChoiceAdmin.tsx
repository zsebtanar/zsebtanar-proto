import React from 'react'
import { PlusCircle as PlusCircleIcon, Trash2 as TrashIcon } from 'react-feather'
import { UCSingleChoice } from 'shared/exercise/types'
import { useModel, UseModelProps } from 'client/generic/hooks/model'
import { UserControlNameInput } from '../common/UserControlNameInput'
import { MarkdownWithScript } from 'client/script/components/MarkdownWithCode'
import { Checkbox } from 'client/generic/components/form/input/Checkbox'
import { Button } from 'client/generic/components/Button'
import { RadioInput } from 'client/generic/components/form/input/RadioInput'
import { TextEditor } from 'client/generic/components/form/input/TextEditor'
import { Icon } from 'client/generic/components/icons/Icon'
import { Alert } from 'client/generic/components/Alert'
import { usePocketLisp } from 'client/script/providers/PocketLispProvider'
import { PLHashMap, PLString, PLVector } from 'pocket-lisp-stdlib'
import { CodeExample } from 'client/generic/components/CodeExample'
import { noop } from 'shared/utils/fn'

export function SingleChoiceAdmin(bindProps: UseModelProps<UCSingleChoice>): JSX.Element {
  const { data, bind, remove, append } = useModel<UCSingleChoice>(bindProps)
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
    <div className="user-control uc-simple-text uc-simple-text-admin">
      <UserControlNameInput {...bind('name')} />

      <div>
        <Checkbox {...bind('isDynamic')}>Dinamikus</Checkbox>
      </div>

      <hr />

      <h6>Opciók</h6>
      {data.isDynamic && !hasName && <div>Adj nevet a megoldási mezőnek!</div>}
      {data.isDynamic && hasName && !hasSolution && (
        <div>
          Definiáld a megoldásfüggvényt! Ügyelj arra, hogy csak egy jó megoldást adj meg! Minta:
          <CodeExample>
            {`(def x [{"Rossz választás." false},
        {"Ez is rossz válasz." false},
        {"Ez a jó válasz!" true},
        {"Ez szintén rossz." false}])
(def solution-`}
            {data.name}
            {` (const x))`}
          </CodeExample>
        </div>
      )}
      {data.isDynamic && hasName && hasSolution && (
        <div>
          {solution.map((item, idx) => (
            <div key={idx} className="d-flex justify-content-between">
              <RadioInput
                name={idx.toString()}
                id={idx + '-true'}
                value={'true'}
                checked={item.values().next().value?.toString() === 'true'}
                onChange={noop}
                inputValue={item.values().next().value?.toString()}
                disabled
              >
                <MarkdownWithScript source={item.keys().next().value} />
              </RadioInput>
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
                      <RadioInput inputValue={idx} {...bind(`solution`)} className="mt-1" />
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
