import React from 'react'
import { useModel, UseModelProps } from 'client/generic/hooks/model'
import { UCFractionNumber } from 'shared/exercise/types'
import { UserControlNameInput } from '../common/UserControlNameInput'
import { Checkbox } from 'client/generic/components/form/input/Checkbox'
import { FormGroup } from 'client/generic/components/form/FormGroup'
import { TextEditor } from 'client/generic/components/form/input/TextEditor'
import { MarkdownWithScript } from '../../../../script/components/MarkdownWithCode'
import { NumberInput } from 'client/generic/components/form/input/NumberInput'
import { usePocketLisp } from 'client/script/providers/PocketLispProvider'
import { PLHashMap, PLString, PLVector } from 'pocket-lisp-stdlib'
import { CodeExample } from 'client/generic/components/CodeExample'
import { noop } from 'shared/utils/fn'

export function FractionNumberAdmin(bindProps: UseModelProps<UCFractionNumber>): JSX.Element {
  const { data, bind } = useModel<UCFractionNumber>(bindProps)
  const { evalPL } = usePocketLisp()
  let solution: Map<string, PLString> = new Map()
  let hasSolution = false
  const hasName = data.name !== undefined
  if (data.isDynamic) {
    const dynamicSolution = evalPL(`(solution-${data.name})`) as PLHashMap<PLString>
    if (dynamicSolution !== undefined) {
      solution = dynamicSolution.toJS()
      hasSolution = true
    }
  }

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
      {data.isDynamic && !hasName && <div>Adj nevet a megoldási mezőnek!</div>}
      {data.isDynamic && hasName && !hasSolution && (
        <div>
          Definiáld a megoldásfüggvényt! A <b>numerator</b> a számlálót, a <b>denominator</b> a
          nevezőt jelöli. Minta:
          <CodeExample>
            {`(def x {"numerator" 23 "denominator" 1234})
(def solution-`}
            {data.name}
            {` (const x))`}
          </CodeExample>
        </div>
      )}
      {data.isDynamic && hasName && hasSolution && (
        <div className="mx-2 text-center">
          <strong>&nbsp;{solution.get('numerator')?.value ?? 'N/A'}&nbsp;</strong>
          <hr className="my-1" />
          <strong>&nbsp;{solution.get('denominator')?.value ?? 'N/A'}&nbsp;</strong>
        </div>
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
