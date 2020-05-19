import * as React from 'react'
import { MarkdownProps, Markdown } from 'client-common/component/general/Markdown'
import { usePocketLisp } from 'client-common/services/generator/PocketLispProvider'

interface Props extends MarkdownProps {}

export function MarkdownWithCode({ source, ...rest }: Props) {
  const interpreter = usePocketLisp()

  const newSource = source.replace(/@(.+?)@/g, (match, code: string) => {
    try {
      const result = interpreter.eval(code) as Object
      return result && result.toString()
    } catch (e) {
      return `\`[Eval of "${code}" failed: ${e.message}\``
    }
  })

  return <Markdown source={newSource} {...rest} />
}
