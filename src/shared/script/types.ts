import { Interpreter } from 'pocket-lisp'

export type EvalScript = (s: string) => ReturnType<Interpreter['interpret']>
