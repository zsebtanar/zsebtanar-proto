// Process ~[name](wikiPageRef)

'use strict'

export function wikiLink() {
  return function wikiLinkMD(state, silent) {
    // tslint:disable-next-line:one-variable-per-declaration
    let attrs,
      code,
      content,
      labelEnd,
      labelStart,
      pos,
      token,
      start,
      resRef = '',
      // tslint:disable-next-line:prefer-const
      oldPos = state.pos,
      // tslint:disable-next-line:prefer-const
      max = state.posMax

    if (state.src.charCodeAt(state.pos + 0) !== 0x7e /* ~ */) return false
    if (state.src.charCodeAt(state.pos + 1) !== 0x5b /* [ */) return false

    labelStart = state.pos + 2
    labelEnd = state.md.helpers.parseLinkLabel(state, state.pos + 2, false)

    // parser failed to find ']', so it's not a valid link
    if (labelEnd < 0) {
      return false
    }

    pos = labelEnd + 1
    if (pos < max && state.src.charCodeAt(pos) === 0x28 /* ( */) {
      //
      // Inline link
      //

      // [link](  <href>  )
      //        ^^ skipping these spaces
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

      // [link](  <href>  )
      //          ^^^^^^ parsing link destination
      // <editor-fold desc="parsing link destination">
      start = pos
      for (; pos < max; pos++) {
        code = state.src.charCodeAt(pos)
        if (isSpace(code) || code === 0x0a /* " */ || code === 0x29 /* ) */) {
          break
        }
      }
      if (pos >= max) {
        return false
      }
      resRef = state.src.substr(start, pos - start)
      // </editor-fold>

      // [link](  <href>  )
      //                ^^ skipping these spaces
      // <editor-fold desc="skip spaces">
      start = pos
      for (; pos < max; pos++) {
        code = state.src.charCodeAt(pos)
        if (!isSpace(code) && code !== 0x0a) {
          break
        }
      }
      // </editor-fold>

      if (pos >= max || state.src.charCodeAt(pos) !== 0x29 /* ) */) {
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
      content = state.src.slice(labelStart, labelEnd)

      state.pos = labelStart
      state.posMax = labelEnd

      token = state.push('wikiLink_open', 'a', 1)
      token.attrs = attrs = []
      attrs.push(['href', '#' + resRef])
      attrs.push(['class', 'wiki-link'])

      if (content) {
        attrs.push(['title', content])
      }

      state.md.inline.tokenize(state)

      token = state.push('link_close', 'a', -1)
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

export function wikiLinkInit() {
  return function(md) {
    md.inline.ruler.before('link', 'wikiLink', wikiLink())
  }
}
