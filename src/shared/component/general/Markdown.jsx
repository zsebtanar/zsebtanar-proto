import React from 'react'
import Markdown from 'markdown-it/lib/index'
import katex from 'markdown-it-katex'
import PropTypes from 'prop-types'

export default (class extends React.Component {
  static propTypes = {
    source: PropTypes.string,
    mark: PropTypes.string
  }

  initMD(options) {
    this.md = new Markdown(options).use(katex)
  }

  render() {
    return (
      <div className="markdown">
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
    if (nextProps.options !== this.props.options) {
      this.initMD(nextProps.options)
    }
  }

  renderMarkdown(source) {
    if (!this.md) {
      this.initMD(this.props.options)
    }
    return this.md.render(source)
  }
})
