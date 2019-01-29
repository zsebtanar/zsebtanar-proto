function injectCSS(htmlWebpackPlugin, compilation) {
  // source: https://github.com/numical/style-ext-html-webpack-plugin/pull/40
  const cssIdxToInline = []
  const output = []

  if ('inlineCSSRegex' in htmlWebpackPlugin.options) {
    for (let cssIdx in htmlWebpackPlugin.files.css) {
      // Get path of this file and remove hash
      const fullPublicPath = htmlWebpackPlugin.files.css[cssIdx].replace(/\?\w*$/, '')
      // For all inlineCSSRegex specified in HtmlWebpackPlugin check for match
      // We allow regex to find in full public path, not just filename, as it may be handy
      for (let rIdx in htmlWebpackPlugin.options.inlineCSSRegex) {
        const regExp = new RegExp(htmlWebpackPlugin.options.inlineCSSRegex[rIdx])
        if (regExp.test(fullPublicPath)) {
          if (!cssIdxToInline.includes(cssIdx)) {
            cssIdxToInline.push(cssIdx)
          }
          // break; // possible to break in first match
        }
      }
    }
  }

  for (let cssIdx in htmlWebpackPlugin.files.css) {
    // INLINE CSS
    // If this cssIdx is not in cssIdxToInline, then skip
    if (!cssIdxToInline.includes(cssIdx)) {
      continue
    }
    // Get path of this file
    const fullPublicPath = htmlWebpackPlugin.files.css[cssIdx]
    // Get filename
    const fileName = /[^/]*$/.exec(fullPublicPath)[0].replace(/\?\w*$/, '')
    // Get source
    const source = compilation.assets[fileName].source()
    // Echo source in style tags
    if (source) {
      output.push(`<style>${source}</style>`)
    }
  }

  for (let cssIdx in htmlWebpackPlugin.files.css) {
    if (cssIdxToInline.includes(cssIdx)) continue
    output.push(
      `<link href="${htmlWebpackPlugin.files.css[cssIdx]}" rel="stylesheet" type="text/css">`
    )
  }

  return output.join('\n')
}

function injectJS(htmlWebpackPlugin) {
  const output = []

  for (let item in htmlWebpackPlugin.options.scripts) {
    if (typeof item === 'string' || item instanceof String) {
      item = `src="${item} type="text/javascript"`
    }
    output.push(`<script ${item}></script>`)
  }

  for (let chunk in htmlWebpackPlugin.files.chunks) {
    output.push(`<script async src="${htmlWebpackPlugin.files.chunks[chunk].entry}"></script>`)
  }
  return output.join('\n')
}

module.exports = {
  injectJS,
  injectCSS
}
