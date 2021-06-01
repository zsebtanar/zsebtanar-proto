import Markdown from 'markdown-it'
import { youtubeEmbedInit } from './index'

describe('youtube embed', () => {
  let md: Markdown = undefined

  beforeEach(() => (md = new Markdown({}).use(youtubeEmbedInit())))

  afterEach(() => (md = undefined))

  it('should generate youtube embed tag', () => {
    const actual = md?.render('!![video-id]').trim()
    const expected =
      '<p><lite-youtube videoid="video-id" class="md-youtube-embed"></lite-youtube></p>'
    expect(actual).toEqual(expected)
  })

  it('should ignore characters after the id', () => {
    const actual = md?.render('!![video-id "hello world]').trim()
    const expected =
      '<p><lite-youtube videoid="video-id" class="md-youtube-embed"></lite-youtube></p>'
    expect(actual).toEqual(expected)
  })
})
