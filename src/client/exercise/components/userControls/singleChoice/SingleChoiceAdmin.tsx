import React from 'react'
import { PlusCircle as PlusCircleIcon, Trash2 as TrashIcon } from 'react-feather'
import { UCSingleChoice, UCSingleChoiceOption } from 'shared/exercise/types'
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
import { PLHashMap, PLString, PLVector, PLNumber } from 'pocket-lisp-stdlib'
import { CodeExample } from 'client/generic/components/CodeExample'
import { noop } from 'shared/utils/fn'
import { convertPLHashMap } from 'client/generic/utils/fn'
import { SingleChoice } from './SingleChoice'

export function SingleChoiceAdmin(bindProps: UseModelProps<UCSingleChoice>): JSX.Element {
  const { data, bind, remove, append } = useModel<UCSingleChoice>(bindProps)
  const { evalPL } = usePocketLisp()
  let hasSolution = false
  const hasName = data.name !== undefined || data.name === ''
  const previewCtlr = { ...data }
  if (data.isDynamic) {
    const dynamicSolution = evalPL(`(solution-${data.name})`) as PLNumber
    const dynamicOptions = evalPL(`(options-${data.name})`) as PLVector<PLHashMap<PLString>>
    if (dynamicSolution !== undefined && dynamicOptions !== undefined) {
      hasSolution = true
      previewCtlr.solution = dynamicSolution.toJS() as number
      previewCtlr.props = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(data.props as any),
        options: convertPLHashMap(dynamicOptions) as UCSingleChoiceOption[],
      }
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
          Definiáld a megoldásfüggvényt! A helyes megoldás sorszámál a sorszámozást 0-val kezdd!
          Minta:
          <CodeExample>
            {`
(def options [{"label" "Rossz választás."},
              {"label" "Ez is rossz válasz."},
              {"label" "Ez a jó válasz!"},
              {"label" "Ez szintén rossz."}])
(def solution-index 2)
(def solution-${data.name} (const solution-index))
(def options-${data.name} (const options))
`}
          </CodeExample>
        </div>
      )}
      {data.isDynamic && hasName && hasSolution && (
        <SingleChoice
          name={data.name}
          value={previewCtlr.solution}
          onChange={noop}
          readonly={true}
          ctrl={previewCtlr}
        />
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
