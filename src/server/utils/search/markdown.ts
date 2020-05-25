import Markdown from 'markdown-it'
import katex from 'markdown-it-katex'
import kbd from 'markdown-it-kbd'
import centertext from 'markdown-it-center-text'
import { imageInit } from 'shared/markdown/image-resource'
import { wikiLinkInit } from '../../../shared/markdown/wiki-link'

export const unTokeniseMarkdown = description =>
  reduceTokenList(initMarkdown().parse(description))
    .join(' ')
    .replace(/-\w+/g, '')
    .replace(/[*.?!%:]/g, '')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim()

const initMarkdown = () =>
  new Markdown({})
    .use(katex)
    .use(kbd)
    .use(centertext)
    .use(wikiLinkInit())
    .use(imageInit({}))

const reduceTokenList = tokenList =>
  tokenList.reduce((acc, i) => {
    if (i.type === 'text') {
      return acc.concat(i.content)
    }
    if (i.type === 'inline') {
      return acc.concat(reduceTokenList(i.children))
    }
    return acc
  }, [])
