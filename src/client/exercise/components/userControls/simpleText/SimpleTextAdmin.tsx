import React from 'react'
import { PlusCircle as PlusCircleIcon, Trash2 as TrashIcon } from 'react-feather'
import { UCSimpleText } from 'shared/exercise/types'
import { MarkdownWithScript } from 'client/script/components/MarkdownWithCode'
import { useModel, UseModelProps } from 'client/generic/hooks/model'
import { UserControlNameInput } from '../common/UserControlNameInput'
import { Checkbox } from 'client/generic/components/form/input/Checkbox'
import { FormGroup } from 'client/generic/components/form/FormGroup'
import { TextEditor } from 'client/generic/components/form/input/TextEditor'
import { Button } from 'client/generic/components/Button'
import { Input } from 'client/generic/components/form/input/Input'
import { Icon } from 'client/generic/components/icons/Icon'
import { usePocketLisp } from 'client/script/providers/PocketLispProvider'
import { noop } from 'shared/utils/fn'
import { SimpleText } from 'client/exercise/components/userControls/simpleText/SimpleText'
import { PLString, PLVector } from 'pocket-lisp-stdlib'
import { CodeExample } from 'client/generic/components/CodeExample'

export function SimpleTextAdmin(bindProps: UseModelProps<UCSimpleText>): JSX.Element {
  const { data, bind, remove, append } = useModel<UCSimpleText>(bindProps)
  const { evalPL } = usePocketLisp()
  let solution: string[] = []
  let hasSolution = false
  const hasName = data.name !== undefined
  if (data.isDynamic) {
    const dynamicSolution = evalPL(`(solution-${data.name})`) as PLVector<PLString>
    if (dynamicSolution !== undefined) {
      solution = dynamicSolution.toJS() as string[]
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

      <FormGroup label="Előtag">
        {(id) => <TextEditor {...bind('props.prefix')} id={id} preview={MarkdownWithScript} />}
      </FormGroup>
      <FormGroup label="Utótag">
        {(id) => <TextEditor {...bind('props.postfix')} id={id} preview={MarkdownWithScript} />}
      </FormGroup>
      <hr />

      <div>
        <Checkbox {...bind('props.ignoreSpaces')}>Szóközök figyelmen kívül hagyása</Checkbox>
      </div>
      <div className="my-2">
        <Checkbox {...bind('props.caseSensitive')}>Kis- és nagybetűk megkülönböztetése</Checkbox>
      </div>

      <FormGroup label="Megoldások">
        {() => (
          <>
            {data.isDynamic && !hasName && <div>Adj nevet a megoldási mezőnek!</div>}
            {data.isDynamic && hasName && !hasSolution && (
              <div>
                Definiáld a megoldásfüggvényt! Minta:
                <CodeExample>
                  {`
(def x ["matek" "matematika"])
(def solution-${data.name} (const x))
`}
                </CodeExample>
              </div>
            )}
            {data.isDynamic && hasName && hasSolution && (
              <ol>
                {solution?.map((item, idx) => (
                  <li key={idx}>
                    <SimpleText
                      disabled={true}
                      readonly={true}
                      ctrl={data}
                      onChange={noop}
                      name={data.name}
                      value={item}
                    />
                  </li>
                ))}
              </ol>
            )}
            {!data.isDynamic && (
              <div>
                <Button btn="link" small onAction={() => append('solution', '')}>
                  <Icon icon={PlusCircleIcon} /> Alternatív megoldás megadása
                </Button>
                <ol>
                  {data.solution?.map((item, idx) => (
                    <li key={idx}>
                      <div className="d-flex">
                        <Input
                          {...bind(`solution.${idx}`)}
                          type="text"
                          className="form-control mt-1"
                          required
                        />
                        <Button
                          small
                          btn="link"
                          className="text-danger"
                          onAction={() => remove(`solution.${idx}`)}
                        >
                          <Icon icon={TrashIcon} />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </>
        )}
      </FormGroup>
    </div>
  )
}
