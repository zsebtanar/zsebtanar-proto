import React, { useEffect, useRef, useState } from 'react'
import { matchAllHunVowel, TAG_REGEXP } from 'shared/utils/string'
import * as MD from 'markdown-it'
import * as katex from 'markdown-it-katex'
import * as kbd from 'markdown-it-kbd'
import * as centertext from 'markdown-it-center-text'
import { imageInit } from 'shared/markdown/image-resource'
import { wikiLinkInit } from 'shared/markdown/wiki-link'
import { MarkdownProps } from './types'
import { useAttachment } from 'client/attachments/providers/AttachmentProvider'

import './Markdown.scss'

///

const katexOptions = {
  displayMode: false,
  unicodeTextInMathMode: true
}

interface MarkdownIt {
  use(plugin: unknown, options: unknown)
  render(text: string)
}

///

export function Markdown({ source, options, mark, onWikiLink, className }: MarkdownProps) {
  const container = useRef<HTMLDivElement>(null)
  const [md, setMD] = useState<MarkdownIt | undefined>(undefined)
  const attachments = useAttachment()

  const handleOnClick = (event: MouseEvent) => {
    const target = event.target as HTMLDivElement
    if (onWikiLink && target && /\bwiki-link\b/.test(target.className)) {
      event.preventDefault()
      const id = target.getAttribute('href')?.substr(1) ?? ''
      onWikiLink(id)
    }
  }

  useEffect(() => {
    const currentContainer = container.current
    currentContainer?.addEventListener('click', handleOnClick, false)
    return () => {
      currentContainer?.removeEventListener('click', handleOnClick, false)
    }
  }, [container])

  useEffect(() => {
    setMD(
      new MD(options)
        .use(katex, katexOptions)
        .use(kbd)
        .use(centertext)
        .use(wikiLinkInit())
        .use(imageInit(attachments || {}))
    )
  }, [options, attachments])

  const __html = source && md ? markText(mark, md.render(source)) : undefined

  return (
    <div
      className={`markdown ${className || ''}`}
      ref={container}
      dangerouslySetInnerHTML={{ __html }}
    />
  )
}

///

function markText(mark, text) {
  if (mark) {
    const markRE = mark && new RegExp(`(${matchAllHunVowel(mark)})`, 'gi')
    return text
      .split(TAG_REGEXP)
      .map(txt => (txt && txt[0] !== '<' ? txt.replace(markRE, '<mark>$1</mark>') : txt))
      .join('')
  }
  return text
}

export default Markdown
