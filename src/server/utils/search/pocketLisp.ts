import { runtime, utils, literals } from 'pocket-lisp-stdlib'
import { Interpreter, Parser, Scanner } from 'pocket-lisp'
import { valueSet } from 'shared/script/shared-code'
import { interpretMarkdown } from 'shared/script/pocketLispMarkdown'
import { PseudoRandomNumberGenerator } from 'shared/math/random'

export function interpretExerciseMarkdown(source: string, markdown: string, seed = 1): string {
  const prng = new PseudoRandomNumberGenerator(seed)
  const globals = { ...runtime, ...valueSet(prng) }
  const stdout = (msg) => console.error({ msg: msg.toJS ? msg.toJS() : msg.toString(), source })
  const interpreter = new Interpreter({ globals, stdout, utils }, literals)

  const interpret = (script) => {
    const parserResult = new Parser(new Scanner(script), literals).parse()
    if (parserResult.hasError) {
      throw parserResult.errors
    }
    return interpreter.interpret(parserResult.program)
  }

  interpret(source)

  return interpretMarkdown(interpret, markdown)
}
