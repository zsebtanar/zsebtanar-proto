import React from 'react'
import Markdown from 'markdown-it'
import katex from 'markdown-it-katex'
import PropTypes from 'prop-types'

export default (class extends React.Component {
  static propTypes = {
    source: PropTypes.string
  }

  initMD (options) {
    this.md = new Markdown(options).use(katex)
  }

  render () {
    return <div className="markdown">
      {
        this.props.source
          ? <span dangerouslySetInnerHTML={{__html: this.renderMarkdown(this.props.source)}}/>
          : ''
      }
    </div>
  }

  componentWillUpdate (nextProps) {
    if (nextProps.options !== this.props.options) {
      this.initMD(nextProps.options)
    }
  }

  renderMarkdown (source) {
    if (!this.md) {
      this.initMD(this.props.options)
    }
    return this.md.render(source)
  }
})
