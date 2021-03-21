import { runtime, utils, literals } from 'pocket-lisp-stdlib'
import { Interpreter, Parser, Scanner } from 'pocket-lisp'
import { valueSet } from 'shared/script/shared-code'
import { interpretMarkdown } from 'shared/script/pocketLispMarkdown'
import { PseudoRandomNumberGenerator } from 'shared/math/random'

export type EvalScript = (s: string) => ReturnType<Interpreter['interpret']>

export function initInterpreter(source: string, seed = 1): EvalScript {
  const prng = new PseudoRandomNumberGenerator(seed)
  const globals = { ...runtime, ...valueSet(prng) }
  const stdout = (msg) => console.error({ msg: msg.toJS ? msg.toJS() : msg.toString(), source })
  const interpreter = new Interpreter({ globals, stdout, utils }, literals)

  const evalScript = (script) => {
    const parserResult = new Parser(new Scanner(script), literals).parse()
    if (parserResult.hasError) {
      throw parserResult.errors
    }
    return interpreter.interpret(parserResult.program)
  }

  evalScript(source)

  return evalScript
}

export function interpretExerciseMarkdown(source: string, markdown: string, seed = 1): string {
  const evalScript = initInterpreter(source, seed)

  return interpretMarkdown(evalScript, markdown)
}
