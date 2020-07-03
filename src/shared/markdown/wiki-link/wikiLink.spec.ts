import Markdown from 'markdown-it'
import { wikiLinkInit } from './index'

describe('wikiLink', () => {
  let md: Markdown = undefined

  beforeEach(() => (md = new Markdown({}).use(wikiLinkInit())))

  afterEach(() => (md = undefined))

  it('should gerenare wiki link tag', () => {
    const actual = md?.render('~[link-name](12345abcdef)').trim()
    const expected =
      '<p><a href="#12345abcdef" class="wiki-link" title="link-name">link-name</a></p>'
    expect(actual).toEqual(expected)
  })
})
