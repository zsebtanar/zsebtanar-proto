import * as React from 'react'
import { interpretMarkdown } from 'shared/script/pocketLispMarkdown'
import { usePocketLisp } from '../providers/PocketLispProvider'
import { MarkdownProps } from 'client/generic/components/markdown/types'
import { Markdown } from 'client/generic/components/markdown/Markdown'

interface Props extends MarkdownProps {}

export function MarkdownWithScript({ source, ...rest }: Props): JSX.Element {
  const interpreter = usePocketLisp()

  const newSource = interpretMarkdown(interpreter.evalPL, source)

  return <Markdown source={newSource} {...rest} />
}
