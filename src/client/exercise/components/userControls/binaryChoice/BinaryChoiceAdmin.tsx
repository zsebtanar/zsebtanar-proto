import React from 'react'
import { UCBinaryChoice, UCBinaryChoiceOption } from 'shared/exercise/types'
import { useModel, UseModelProps } from 'client/generic/hooks/model'
import { UserControlNameInput } from '../common/UserControlNameInput'
import { PlusCircle, Trash2 as TrashIcon } from 'react-feather'
import { Checkbox } from 'client/generic/components/form/input/Checkbox'
import { Button } from 'client/generic/components/Button'
import { TextEditor } from 'client/generic/components/form/input/TextEditor'
import { MarkdownWithScript } from 'client/script/components/MarkdownWithCode'
import { Select } from 'client/generic/components/form/input/Select'
import { Icon } from 'client/generic/components/icons/Icon'
import { Alert } from '../../../../generic/components/Alert'
import { usePocketLisp } from 'client/script/providers/PocketLispProvider'
import { PLBool, PLHashMap, PLString, PLVector } from 'pocket-lisp-stdlib'
import { CodeExample } from 'client/generic/components/CodeExample'
import { noop } from 'shared/utils/fn'
import { BinaryChoice } from './BinaryChoice'
import { convertPLHashMap } from 'client/generic/utils/fn'

export function BinaryChoiceAdmin(bindProps: UseModelProps<UCBinaryChoice>): JSX.Element {
  const { bind, data, append, remove } = useModel<UCBinaryChoice>(bindProps)
  const { evalPL } = usePocketLisp()
  let hasSolution = false
  const hasName = data.name !== undefined || data.name === ''
  const previewCtlr = { ...data }
  if (data.isDynamic) {
    const dynamicSolution = evalPL(`(solution-${data.name})`) as PLVector<PLBool>
    const dynamicOptions = evalPL(`(options-${data.name})`) as PLVector<PLHashMap<PLString>>
    if (dynamicSolution !== undefined && dynamicOptions !== undefined) {
      hasSolution = true
      previewCtlr.solution = dynamicSolution.toJS() as boolean[]
      previewCtlr.props = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(data.props as any),
        options: convertPLHashMap(dynamicOptions) as UCBinaryChoiceOption[],
      }
    }
  }

  return (
    <div className="user-control uc-binary-choice uc-binary-choice-admin">
      <UserControlNameInput {...bind('name')} />
      <div>
        <Checkbox {...bind('isDynamic')}>Dinamikus</Checkbox>
      </div>

      <hr />

      <div>
        <Checkbox {...bind('props.randomOrder')} disabled>
          Kitöltéskor az állítások véletlenszerű sorredben jelenjenek meg
        </Checkbox>
      </div>

      <hr />

      <h6>Megoldások</h6>
      {data.isDynamic && !hasName && <div>Adj nevet a megoldási mezőnek!</div>}
      {data.isDynamic && hasName && !hasSolution && (
        <div>
          Definiáld a megoldásfüggvényt! Minta:
          <CodeExample>
            {`
(def options [{"statement" "Ez egy igaz állítás."}
              {"statement" "Ez egy hamis állítás."}
              {"statement" "Ez egy hamis állítás egyedi címkékkel." "trueLabel" "i" "falseLabel" "h"}
              {"statement" "Ez egy igaz állítás egyedi címkékkel." "trueLabel" "I" "falseLabel" "H"}])
(def solution [true, false, false, true])
(def options-${data.name} (const options))
(def solution-${data.name} (const solution))
`}
          </CodeExample>
        </div>
      )}
      {data.isDynamic && hasName && hasSolution && (
        <BinaryChoice
          readonly={true}
          ctrl={previewCtlr}
          onChange={noop}
          name={data.name}
          value={[]}
        />
      )}
      {!data.isDynamic && (
        <div>
          <Button
            btn="link"
            small
            onAction={() => {
              append('props.options', '')
              append('solution', '')
            }}
          >
            <PlusCircle /> Alternatív megoldás megadása
          </Button>
          {!data.props?.options?.length && (
            <Alert type="warning">Nincs megadva választási lehetőség</Alert>
          )}
          {!!data.props?.options?.length && (
            <table className="table table-borderless table-sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th className="w-25">Leírás</th>
                  <th className="w-25">Igaz állítás</th>
                  <th className="w-25">Hamis állítás</th>
                  <th>Megoldás</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {data.props?.options?.map((item, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <TextEditor
                        {...bind(`props.options.${idx}.statement`)}
                        preview={MarkdownWithScript}
                        inline
                      />
                    </td>
                    <td>
                      <TextEditor
                        {...bind(`props.options.${idx}.trueLabel`)}
                        preview={MarkdownWithScript}
                        inline
                      />
                    </td>
                    <td>
                      <TextEditor
                        {...bind(`props.options.${idx}.falseLabel`)}
                        preview={MarkdownWithScript}
                        inline
                      />
                    </td>
                    <td>
                      <Select
                        className="form-control"
                        options={[
                          { label: item.trueLabel, value: true },
                          { label: item.falseLabel, value: false },
                        ]}
                        {...bind(`solution.${idx}`)}
                      />
                    </td>
                    <td>
                      <Button
                        small
                        btn="link"
                        className="text-danger"
                        onAction={() => {
                          remove(`props.options.${idx}`)
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
        </div>
      )}
    </div>
  )
}
