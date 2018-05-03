import React from 'react'
import MD from 'markdown-it/lib/index'
import katex from 'markdown-it-katex'
import { imageInit } from 'shared/markdown/image-resource'

const katexOptions = {
  displayMode: false,
  unicodeTextInMathMode: true
}

export const Markdown = class extends React.PureComponent {
  initMD(options, resources) {
    this.md = new MD(options).use(katex, katexOptions).use(imageInit(resources))
  }

  render() {
    return (
      <div className={`markdown ${this.props.className || ''}`}>
        {this.props.source ? (
          <span
            dangerouslySetInnerHTML={{
              __html: this.markText(this.renderMarkdown(this.props.source))
            }}
          />
        ) : (
          ''
        )}
      </div>
    )
  }

  markText(text) {
    const mark = this.props.mark
    if (mark) {
      return text.replace(new RegExp(`(${mark})`, 'gi'), `<mark>$1</mark>`)
    }
    return text
  }

  componentWillUpdate(nextProps) {
    if (nextProps.options !== this.props.options || nextProps.resources !== this.props.resources) {
      this.initMD(nextProps.options, nextProps.resources)
    }
  }

  renderMarkdown(source) {
    if (!this.md) {
      this.initMD(this.props.options, this.props.resources)
    }
    return this.md.render(source)
  }
}
