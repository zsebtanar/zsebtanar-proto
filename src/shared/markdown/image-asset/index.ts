// Process @[image](resourceRef =WxH)
// Process @[image](6191eaf5c0 )

'use strict'

import { parseImageSize } from './parseImageSize'
import { MD } from '../types'

function assetImageMD(state, silent) {
  let attrs,
    code,
    content,
    labelEnd,
    labelStart,
    pos,
    res,
    width,
    height,
    token,
    start,
    resRef = '',
    // eslint-disable-next-line prefer-const
    oldPos = state.pos,
    // eslint-disable-next-line prefer-const
    max = state.posMax

  if (state.src.charCodeAt(state.pos) !== 0x40 /* @ */) {
    return false
  }
  if (state.src.charCodeAt(state.pos + 1) !== 0x5b /* [ */) {
    return false
  }

  // eslint-disable-next-line prefer-const
  labelStart = state.pos + 2
  // eslint-disable-next-line prefer-const
  labelEnd = state.md.helpers.parseLinkLabel(state, state.pos + 1, false)

  // parser failed to find ']', so it's not a valid link
  if (labelEnd < 0) {
    return false
  }

  pos = labelEnd + 1
  if (pos < max && state.src.charCodeAt(pos) === 0x28 /* ( */) {
    //
    // Inline link
    //

    // [link](  <href>  =WxH  )
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

    // [link](  <href>  =WxH  )
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

    // [link](  <href>  =WxH  )
    //                ^^ skipping these spaces
    // <editor-fold desc="skip spaces">
    for (; pos < max; pos++) {
      code = state.src.charCodeAt(pos)
      if (!isSpace(code) && code !== 0x0a) {
        break
      }
    }
    // </editor-fold>

    // [link](  <href>  =WxH  )
    //                  ^^^^ parsing image size
    // <editor-fold desc="parsing image size">
    if (pos - 1 >= 0) {
      code = state.src.charCodeAt(pos - 1)

      // there must be at least one white spaces
      // between previous field and the size
      if (code === 0x20) {
        res = parseImageSize(state.src, pos, state.posMax)
        if (res.ok) {
          width = res.width
          height = res.height
          pos = res.pos

          // [link](  <href>  =WxH  )
          //                      ^^ skipping these spaces
          for (; pos < max; pos++) {
            code = state.src.charCodeAt(pos)
            if (code !== 0x20 && code !== 0x0a) {
              break
            }
          }
        }
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

    token = state.push('resImage', 'img', 0)
    token.attrs = attrs = [['loading', 'lazy']]
    token.content = content

    if (resRef) {
      attrs.push(['src', resRef])
    }

    if (content) {
      attrs.push(['title', content])
      attrs.push(['alt', content])
    }

    if (width !== '') {
      attrs.push(['width', width])
    }

    if (height !== '') {
      attrs.push(['height', height])
    }
  }

  state.pos = pos
  state.posMax = max
  return true
}

function isSpace(code) {
  switch (code) {
    case 0x09:
    case 0x20:
      return true
  }
  return false
}

export function assetImage(md: MD): void {
  md.inline.ruler.before('link', 'assetImage', assetImageMD)
}
