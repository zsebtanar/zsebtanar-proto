import React from 'react'
import { usePocketLisp } from 'client/script/providers/PocketLispProvider'
import { SimpleText } from 'client/exercise/components/userControls/simpleText/SimpleText'
import { noop } from 'shared/utils/fn'
import { UCSimpleText } from 'shared/exercise/types'

export function DynamicSolution(ctrl: UCSimpleText): JSX.Element {
  const { evalPL } = usePocketLisp()
  let solutionString = ''
  let isDefined = false
  const functionValue = evalPL(`(solution-${ctrl?.name})`) as { toString(): string }
  if (functionValue !== undefined) {
    solutionString = functionValue.toString()
    isDefined = true
  }

  return (
    <div className="form-control-plaintext">
      {isDefined ? (
        <SimpleText
          disabled={true}
          readonly={true}
          onChange={noop}
          ctrl={ctrl}
          name={ctrl.name}
          value={solutionString}
        />
      ) : (
        <div>
          Definiáld a megoldás függvényt: <code>(def solution-{ctrl.name} #(...))</code>
        </div>
      )}
    </div>
  )
}
