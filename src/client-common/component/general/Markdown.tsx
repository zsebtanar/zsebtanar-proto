import * as React from 'react'
import { matchAllHunVowel, TAG_REGEXP } from 'shared/util/string'

import './Markdown.scss'

///

interface MarkdownProps {
  className?: string
  source: MDString
  resources?: MarkdownResources
  mark?: string
  onWikiLink?: (wikiPageId: string) => void
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

///

export class Markdown extends React.PureComponent<MarkdownProps, MarkdownState> {
  private markRE?: RegExp
  private container: HTMLDivElement

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
      import(/* webpackChunkName: 'markdown' */ 'markdown-it-kbd'),
      import(/* webpackChunkName: 'markdown' */ 'markdown-it-center-text'),
      import(/* webpackChunkName: 'markdown' */ 'shared/markdown/image-resource/index'),
      import(/* webpackChunkName: 'markdown' */ 'shared/markdown/wiki-link/index')
    ]).then(
      ([
        { default: MD },
        { default: katex },
        { default: kbd },
        { default: centertext },
        { imageInit },
        { wikiLinkInit }
      ]) => {
        const md = new MD(options)
          .use(katex, katexOptions)
          .use(kbd)
          .use(centertext)
          .use(wikiLinkInit())
          .use(imageInit(resources || {}))
        this.setState({ md })
      }
    )
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

  public componentWillUnmount(): void {
    if (this.container) {
      this.container.removeEventListener('click', this.handleOnClick, false)
    }
  }

  public componentWillUpdate(nextProps) {
    if (nextProps.options !== this.props.options || nextProps.resources !== this.props.resources) {
      this.initMD(nextProps.options, nextProps.resources)
    }
    this.initMark()
  }

  public render() {
    return (
      <div className={`markdown ${this.props.className || ''}`} ref={this.onRef}>
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

  private onRef = ref => {
    if (ref) {
      this.container = ref
      this.container.addEventListener('click', this.handleOnClick, false)
    }
  }

  private handleOnClick = (event: MouseEvent) => {
    const target = event.target as HTMLDivElement
    if (this.props.onWikiLink && /\bwiki-link\b/.test(target.className)) {
      event.preventDefault()
      const id = (target as any).getAttribute('href').substr(1)
      this.props.onWikiLink(id)
    }
  }
}
