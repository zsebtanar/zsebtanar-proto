import * as React from 'react'
import { matchAllHunVowel, TAG_REGEXP } from 'shared/util/string'

interface MarkdownProps {
  className?: string
  source: MDString
  resources?: MarkdownResources
  mark?: string
  // TODO: markdown options type
  options?: any
}

interface MarkdownState {
  md: any
}

const katexOptions = {
  displayMode: false,
  unicodeTextInMathMode: true
}

export const Markdown = class extends React.PureComponent<MarkdownProps, MarkdownState> {
  private markRE?: RegExp

  state = {
    md: undefined
  }

  constructor(props) {
    super(props)
    this.state = {
      md: null
    }
    this.initMark()
  }

  private initMark() {
    this.markRE = this.props.mark && new RegExp(`(${matchAllHunVowel(this.props.mark)})`, 'gi')
  }

  private initMD(options, resources) {
    Promise.all([
      import(/* webpackChunkName: 'markdown' */ 'markdown-it'),
      import(/* webpackChunkName: 'markdown' */ 'markdown-it-katex') as Promise<any>,
      import(/* webpackChunkName: 'markdown' */ 'shared/markdown/image-resource/index')
    ]).then(([{ default: MD }, { default: katex }, { imageInit }]) => {
      const md = new MD(options).use(katex, katexOptions).use(imageInit(resources || {}))
      this.setState({ md })
    })
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
    if (!this.state.md) {
      this.initMD(this.props.options, this.props.resources)
      return ''
    } else {
      return this.state.md.render(source)
    }
  }
}
