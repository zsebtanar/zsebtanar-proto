import React, { ReactNode, useState, useMemo, useCallback } from 'react'
import { Interpreter, Parser, Scanner } from 'pocket-lisp'
import { toJS, runtime, utils, literals } from 'pocket-lisp-stdlib'
import { valueSet } from 'shared/script/shared-code'
import { PseudoRandomNumberGenerator } from 'shared/math/random'

interface Props {
  seed?: number
  isEdit?: boolean
  script?: string
  children: ReactNode
}

export type InterpreterOutput = {
  type: 'normal' | 'error'
  msg: string
}

interface InterpreterContextAPI {
  script: string
  current?: Interpreter
  run(source: string)
  evalPL(source: string): unknown
  getGlobalNames(): string[]
  getOutput(): InterpreterOutput[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PocketLispContext = React.createContext<InterpreterContextAPI>({} as any)

let output: InterpreterOutput[] = []

export function PocketLispProvider({ children, seed, isEdit, script }: Props) {
  const [interpreter, setInterpreter] = useState<Interpreter>()

  const setOutput = useCallback((msg, type: InterpreterOutput['type'] = 'normal') => {
    if (msg) {
      output = output.concat({ type, msg: msg[toJS] ? msg[toJS]() : msg.toString() })
    }
  }, [])

  React.useEffect(() => {
    const prng = new PseudoRandomNumberGenerator(seed)
    const globals = { ...runtime, ...valueSet(prng) }
    const stdout = isEdit ? setOutput : () => undefined
    const interpreter = new Interpreter({ globals, stdout, utils }, literals)
    setInterpreter(interpreter)
  }, [seed, isEdit])

  const interpret = useCallback(
    (source: string) => {
      if (!interpreter) {
        return setOutput('Interpreter not initialized', 'error')
      }
      const parserResult = new Parser(new Scanner(source), literals).parse()
      if (parserResult.hasError) {
        return parserResult.errors.map(err => setOutput(err.message, 'error'))
      }
      try {
        return interpreter.interpret(parserResult.program)
      } catch (e) {
        setOutput(e, 'error')
      }
      return undefined
    },
    [setOutput, interpreter],
  )

  const api = useMemo(
    () => ({
      current: interpreter,
      run(source: string) {
        output = []
        const result = interpret(source)
        if (result) {
          setOutput(result)
        }
      },
      evalPL(source: string) {
        return interpret(source)
      },
      getGlobalNames(): string[] {
        return interpreter ? interpreter.getGlobalNames() : []
      },
      getOutput(): InterpreterOutput[] {
        return output
      },
    }),
    [interpret, interpreter, setOutput, script],
  )
  if (script) api.run(script)
  return (
    <PocketLispContext.Provider value={{ ...api, script: script ?? '' }}>
      {children}
    </PocketLispContext.Provider>
  )
}

export function usePocketLisp() {
  const context = React.useContext(PocketLispContext)
  if (context === undefined) {
    throw new Error('usePocketLisp must be used within a PocketLispContext')
  }
  return context
}
