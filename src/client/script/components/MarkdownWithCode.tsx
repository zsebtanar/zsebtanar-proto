import * as React from 'react'
import { Markdown, MarkdownProps } from 'client/generic/components/markdown'
import { usePocketLisp } from '../providers/PocketLispProvider'
import { interpretMarkdown } from 'shared/script/pocketLispMarkdown'

interface Props extends MarkdownProps {}

export function MarkdownWithScript({ source, ...rest }: Props) {
  const interpreter = usePocketLisp()

  const newSource = interpretMarkdown(interpreter.eval, source)

  return <Markdown source={newSource} {...rest} />
}
