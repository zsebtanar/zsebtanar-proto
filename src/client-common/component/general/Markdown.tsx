import * as React from 'react'
import * as MD from 'markdown-it'
import * as katex from 'markdown-it-katex'
import { imageInit } from '../../../shared/markdown/image-resource/index'

interface MarkdownProps {
  className?: string
  source: MDString
  resources?: MarkdownResources
  mark?: string
  // TODO: markdown options type
  options?: any
}

const katexOptions = {
  displayMode: false,
  unicodeTextInMathMode: true
}

export const Markdown = class extends React.PureComponent<MarkdownProps, {}> {
  private md
  private initMD(options, resources) {
    this.md = new MD(options).use(katex, katexOptions).use(imageInit(resources || {}))
  }

  componentWillUpdate(nextProps) {
    if (nextProps.options !== this.props.options || nextProps.resources !== this.props.resources) {
      this.initMD(nextProps.options, nextProps.resources)
    }
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

  private renderMarkdown(source) {
    if (!this.md) {
      this.initMD(this.props.options, this.props.resources)
    }
    return this.md.render(source)
  }

  private markText(text) {
    const mark = this.props.mark
    if (mark) {
      return text.replace(new RegExp(`(${mark})`, 'gi'), `<mark>$1</mark>`)
    }
    return text
  }
}
