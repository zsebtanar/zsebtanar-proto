import * as React from 'react'
import { Markdown, MarkdownProps } from 'client/generic/components/markdown'
import { usePocketLisp } from '../providers/PocketLispProvider'

interface Props extends MarkdownProps {}

export function MarkdownWithScript({ source, ...rest }: Props) {
  const interpreter = usePocketLisp()

  const newSource = source.replace(/@(.+?)@/g, (match, code: string) => {
    try {
      const result = interpreter.eval(code) as Record<string, any>
      return result && result.toString()
    } catch (e) {
      return `\`[Eval of "${code}" failed: ${e.message}\``
    }
  })

  return <Markdown source={newSource} {...rest} />
}
