import React, { useEffect, useRef, useState } from 'react'
import { matchAllHunVowel, TAG_REGEXP } from 'shared/utils/string'

import './Markdown.scss'

///

interface MarkdownProps {
  className?: string
  source: MDString
  resources?: MarkdownResources
  mark?: string
  onWikiLink?: (wikiPageId: string) => void
  options?: unknown
}

const katexOptions = {
  displayMode: false,
  unicodeTextInMathMode: true
}

interface MarkdownIt {
  use(plugin: unknown, options: unknown)
  render(text: string)
}

///

export function Markdown({
  source,
  options,
  resources,
  mark,
  onWikiLink,
  className
}: MarkdownProps) {
  const container = useRef<HTMLDivElement>(null)
  const [md, setMD] = useState<MarkdownIt | undefined>(undefined)

  const handleOnClick = (event: MouseEvent) => {
    const target = event.target as HTMLDivElement
    if (onWikiLink && target && /\bwiki-link\b/.test(target.className)) {
      event.preventDefault()
      const id = target.getAttribute('href')?.substr(1) ?? ''
      onWikiLink(id)
    }
  }

  useEffect(() => {
    container.current?.addEventListener('click', handleOnClick, false)
    return () => {
      container.current?.removeEventListener('click', handleOnClick, false)
    }
  })

  useEffect(() => {
    createMD(options, resources).then(setMD)
  }, [options, resources])

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

let importPromise
async function createMD(options, resources) {
  if (!importPromise) {
    importPromise = Promise.all([
      import(/* webpackChunkName: 'markdown' */ 'markdown-it'),
      import(/* webpackChunkName: 'markdown' */ 'markdown-it-katex'),
      import(/* webpackChunkName: 'markdown' */ 'markdown-it-kbd'),
      import(/* webpackChunkName: 'markdown' */ 'markdown-it-center-text'),
      import(/* webpackChunkName: 'markdown' */ 'shared/markdown/image-resource/index'),
      import(/* webpackChunkName: 'markdown' */ 'shared/markdown/wiki-link/index')
    ])
  }

  const [
    { default: MD },
    { default: katex },
    { default: kbd },
    { default: centertext },
    { imageInit },
    { wikiLinkInit }
  ] = await importPromise

  return new MD(options)
    .use(katex, katexOptions)
    .use(kbd)
    .use(centertext)
    .use(wikiLinkInit())
    .use(imageInit(resources || {}))
}
