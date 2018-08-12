import * as React from 'react'
import * as MD from 'markdown-it'
import * as katex from 'markdown-it-katex'
import { imageInit } from 'shared/markdown/image-resource/index'
import { matchAllHunVowel, TAG_REGEXP } from 'shared/util/string'

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
  private markRE?: RegExp

  constructor (props) {
    super(props)
    this.initMark()
  }

  private initMark(){
    this.markRE = new RegExp(`(${matchAllHunVowel(this.props.mark)})`, 'gi')
  }

  private initMD(options, resources) {
    this.md = new MD(options).use(katex, katexOptions).use(imageInit(resources || {}))
  }

  private markText(text) {
    const markRE = this.markRE
    if (markRE) {
      return text
        .split(TAG_REGEXP)
        .map(txt => (txt && txt[0] !== '<' ? txt.replace(markRE, '<mark>$1</mark>') : txt))
        .join('')
    }
    return text
  }

  componentWillUpdate(nextProps) {
    if (nextProps.options !== this.props.options || nextProps.resources !== this.props.resources) {
      this.initMD(nextProps.options, nextProps.resources)
    }
    this.initMark()
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
}
