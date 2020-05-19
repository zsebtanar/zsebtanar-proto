import React, { ReactNode, useState } from 'react'
import { Interpreter, Parser, Scanner } from 'pocket-lisp'
import { toJS, runtime, utils, literals } from 'pocket-lisp-stdlib'
import { valueSet } from './shared-code'
import { PseudoRandomNumberGenerator } from 'client/generic/utils/random'

interface Props {
  seed?: number
  isEdit?: boolean
  children: ReactNode
}

export type InterpreterOutput = {
  type: 'normal' | 'error'
  msg: string
}

interface InterpreterContextAPI {
  current?: Interpreter
  run(source: string)
  eval(source: string): unknown
  getGlobalNames(): string[]
  getOutput(): InterpreterOutput[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PocketLispContext = React.createContext<InterpreterContextAPI>({} as any)

let output: InterpreterOutput[] = []

export function PocketLispProvider({ children, seed, isEdit }: Props) {
  const [interpreter, setInterpreter] = useState<Interpreter>()

  const setOutput = (msg, type: InterpreterOutput['type'] = 'normal') => {
    if (msg) {
      output = output.concat({ type, msg: msg[toJS] ? msg[toJS]() : msg.toString() })
    }
  }

  React.useEffect(
    () => {
      const prng = new PseudoRandomNumberGenerator(seed)
      const globals = { ...runtime, ...valueSet(prng) }
      const stdout = isEdit ? setOutput : () => undefined
      const interpreter = new Interpreter({ globals, stdout, utils }, literals)
      setInterpreter(interpreter)
    },
    [seed, isEdit]
  )

  const interpret = (source: string) => {
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
  }

  const api: InterpreterContextAPI = {
    current: interpreter,
    run(source: string) {
      output = []
      const result = interpret(source)
      if (!result) {
        setOutput(result)
      }
    },
    eval(source: string) {
      return interpret(source)
    },
    getGlobalNames(): string[] {
      return interpreter ? interpreter.getGlobalNames() : []
    },
    getOutput(): InterpreterOutput[] {
      return output
    }
  }

  return <PocketLispContext.Provider value={api}>{children}</PocketLispContext.Provider>
}

export function usePocketLisp() {
  const context = React.useContext(PocketLispContext)
  if (context === undefined) {
    throw new Error('usePocketLisp must be used within a PocketLispContext')
  }
  return context
}
