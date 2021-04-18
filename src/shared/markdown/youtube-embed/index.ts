import { MD, State } from '../types'

// Process ~(video ID)

export function youtubeEmbed() {
  return function youtubeEmbedMD(state: State, silent: boolean): boolean {
    let attrs,
      code,
      pos,
      token,
      start,
      resRef = '',
      // eslint-disable-next-line prefer-const
      oldPos = state.pos,
      // eslint-disable-next-line prefer-const
      max = state.posMax

    if (state.src.charCodeAt(state.pos) !== 0x21 /* ! */) return false
    if (state.src.charCodeAt(state.pos + 1) !== 0x21 /* ! */) return false
    if (state.src.charCodeAt(state.pos + 2) !== 0x5b /* [ */) return false

    pos = state.pos + 2
    if (pos < max && state.src.charCodeAt(pos) === 0x5b /* [ */) {
      //
      // Inline link
      //

      // [  <videoID>  ]
      //  ^^ skipping these spaces
      // <editor-fold desc="skip spaces">
      pos++
      for (; pos < max; pos++) {
        code = state.src.charCodeAt(pos)
        if (!isSpace(code) && code !== 0x0a) {
          break
        }
      }
      if (pos >= max) {
        return false
      }
      // </editor-fold>

      // [  <videoID>  ]
      //     ^^^^^^^ parsing link destination
      // <editor-fold desc="parsing link destination">
      start = pos
      for (; pos < max; pos++) {
        code = state.src.charCodeAt(pos)
        if (isSpace(code) || code === 0x0a /* " */ || code === 0x5d /* ] */) {
          break
        }
      }
      if (pos >= max) {
        return false
      }
      resRef = state.src.substr(start, pos - start)
      // </editor-fold>

      // [  <videoID>  ]
      //             ^^ skipping these spaces
      // <editor-fold desc="skip spaces">
      for (; pos < max; pos++) {
        code = state.src.charCodeAt(pos)
        if (!isSpace(code) && code !== 0x0a) {
          break
        }
      }
      // </editor-fold>

      if (pos >= max || state.src.charCodeAt(pos) !== 0x5d /* ] */) {
        state.pos = oldPos
        return false
      }
      pos++
    }

    //
    // We found the end of the link, and know for a fact it's a valid link;
    // so all that's left to do is to call tokenizer.
    //
    if (!silent) {
      token = state.push('youtubeEmbed_open', 'lite-youtube', 1)
      token.attrs = attrs = []
      attrs.push(['videoid', resRef])
      attrs.push(['class', 'md-youtube-embed'])

      state.push('youtubeEmbed_close', 'lite-youtube', -1)
    }

    state.pos = pos
    state.posMax = max
    return true
  }
}

function isSpace(code) {
  switch (code) {
    case 0x09:
    case 0x20:
      return true
  }
  return false
}

export function youtubeEmbedInit() {
  return function (md: MD): void {
    md.inline.ruler.before('image', 'youtubeEmbed', youtubeEmbed())
  }
}
