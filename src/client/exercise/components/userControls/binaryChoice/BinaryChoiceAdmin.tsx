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
import { PLBool, PLString, PLVector } from 'pocket-lisp-stdlib'
import { CodeExample } from 'client/generic/components/CodeExample'
import { noop } from 'shared/utils/fn'
import { BinaryChoice } from './BinaryChoice'

export const DEFAULT_TRUE_LABEL = 'Igaz'
export const DEFAULT_FALSE_LABEL = 'Hamis'

export function BinaryChoiceAdmin(bindProps: UseModelProps<UCBinaryChoice>): JSX.Element {
  const { bind, data, append, remove } = useModel<UCBinaryChoice>(bindProps)
  const { evalPL } = usePocketLisp()
  let solutions: boolean[] = []
  let statements: string[] = []
  let trueLabels: string[] | string = []
  let falseLabels: string[] | string = []
  let randomOrder = false
  let hasSolution = false
  const hasName = data.name !== undefined
  const previewCtlr = { ...data }
  if (data.isDynamic) {
    const dynamicSolutions = evalPL(`(solutions-${data.name})`) as PLVector<PLBool>
    const dynamicStatements = evalPL(`(statements-${data.name})`) as PLVector<PLString>
    const dynamicTrueLabels = evalPL(`(true-labels-${data.name})`) as PLVector<PLString>
    const dynamicFalseLabels = evalPL(`(false-labels-${data.name})`) as PLVector<PLString>
    const dynamicRandomOrder = evalPL(`(random-order-${data.name})`) as PLBool
    if (dynamicSolutions !== undefined) {
      solutions = dynamicSolutions.toJS() as boolean[]
      if (dynamicStatements !== undefined) {
        hasSolution = true
        statements = dynamicStatements.toJS() as string[]
        trueLabels =
          dynamicTrueLabels !== undefined
            ? (dynamicTrueLabels.toJS() as string[])
            : DEFAULT_TRUE_LABEL
        falseLabels =
          dynamicTrueLabels !== undefined
            ? (dynamicFalseLabels.toJS() as string[])
            : DEFAULT_FALSE_LABEL
        if (dynamicRandomOrder !== undefined) {
          randomOrder = dynamicRandomOrder.toJS()
        }
        const binaryOptions: UCBinaryChoiceOption[] = []
        statements.forEach((item, idx) => {
          binaryOptions[idx] = {
            statement: item,
            trueLabel: typeof trueLabels === 'string' ? trueLabels : trueLabels[idx],
            falseLabel: typeof falseLabels === 'string' ? falseLabels : falseLabels[idx],
          }
        })
        previewCtlr.props = {
          randomOrder: randomOrder,
          options: binaryOptions,
        }
        previewCtlr.solution = solutions
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
(def allitasok ["Ez egy igaz állítás.",
                "Ez egy hamis állítás.",
                "Ez egy igaz állítás.",
                "Ez egy hamis állítás."])
(def megoldasok [true, false, true, false])
(def igaz-cimkek ["I", "Igaz", "i", "helyes"]) ; nem kötelező megadni
(def hamis-cimkek ["Nem", "N", "n", "nem jó"]) ; nem kötelező megadni
(def veletlen-sorrend true)                    ; nem kötelező megadni

(def statements-${data.name} (const allitasok))
(def solutions-${data.name} (const megoldasok))
(def true-labels-${data.name} (const igaz-cimkek))
(def false-labels-${data.name} (const hamis-cimkek))
(def random-order-${data.name} (const veletlen-sorrend))
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
          value={solutions}
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
