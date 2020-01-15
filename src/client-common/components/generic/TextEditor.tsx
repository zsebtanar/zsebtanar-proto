import { Button } from 'client-common/component/general/Button'
import { Dropdown } from 'client-common/component/general/dropdown/Dropdown'
import { Markdown } from 'client-common/component/general/Markdown'
import {
  openEquationHelpModal,
  openExerciseImageDialog,
  openMarkdownHelpModal,
  openWikiPageSelector
} from 'client-common/store/actions/modal'
import * as React from 'react'
import { connect } from 'react-redux'
import { WikiPageModel } from 'X-client-common/services/wikiPageService'
import { DropdownMenu } from 'client-common/components/generic/dropdown/DropdownMenu'
import { DropdownToggle } from 'client-common/components/generic/dropdown/DropdownToggle'

import 'client-common/components/generic/TextEditor.scss'

///

interface Props {
  value: string
  name: string
  className?: string
  rows?: number
  required?: boolean
  resources: MarkdownResources
  onChange: (data: { name: string; value: string }) => void
}

interface DispatchProps {
  openExerciseImageDialog: typeof openExerciseImageDialog
  openMarkdownHelpModal: typeof openMarkdownHelpModal
  openEquationHelpModal: typeof openEquationHelpModal
  openWikiPageSelector: typeof openWikiPageSelector
}

type AllProps = Props & DispatchProps

interface State {
  value: string
}

///

export const TextEditor = connect(undefined, {
  openExerciseImageDialog,
  openMarkdownHelpModal,
  openEquationHelpModal,
  openWikiPageSelector
})(
  class extends React.Component<AllProps, State> {
    static defaultProp = {
      rows: 10
    }

    private textRef: HTMLTextAreaElement
    state = { value: this.props.value || '' }

    private wrapText = (token: string, sample = '') => () => {
      const { selectionStart: start, selectionEnd: end, value } = this.textRef

      const noSelection = sample && start === end
      const before = value.slice(0, start)
      const selected = noSelection ? sample : value.slice(start, end)
      const after = value.slice(end)

      this.textRef.value = `${before}${token}${selected}${token}${after}`
      if (noSelection) {
        this.textRef.selectionStart = start + token.length
        this.textRef.selectionEnd = end + sample.length + token.length
      } else {
        this.textRef.selectionEnd = end + token.length
      }
      this.update()
    }

    private multiLine = (token: string, sample = '') => () => {
      const { selectionStart, selectionEnd: end, value } = this.textRef
      const start = value.lastIndexOf('\n', selectionStart) + 1

      const noSelection = sample && start === end
      const before = value.slice(0, start)
      const text = noSelection ? sample : value.slice(start, end)
      const result = text
        .split('\n')
        .map(x => `${token}${x}`)
        .join('\n')
      const after = value.slice(end)
      this.textRef.value = `${before}${result}${after}`

      if (noSelection) {
        this.textRef.selectionStart = start + token.length
      }
      this.textRef.selectionEnd = end + result.length
      this.update()
    }

    private insertLink = (sample = '') => () => {
      const { selectionStart: start, selectionEnd: end, value } = this.textRef

      const noSelection = sample && start === end
      const before = value.slice(0, start)
      const selected = noSelection ? sample : value.slice(start, end)
      const after = value.slice(end)
      const url = 'https://example.com'

      this.textRef.value = `${before}[${selected}](${url})${after}`

      this.textRef.selectionStart = start + selected.length + 3
      this.textRef.selectionEnd = this.textRef.selectionStart + url.length
      this.update()
    }

    private insertFile = () => {
      this.props.openExerciseImageDialog({
        onSelect: ({ id, file }) => {
          this.textRef.value += `@[${file.name}](${id} =100x)`
          this.update()
        }
      })
    }

    private insertWikiLink = () => {
      const { openWikiPageSelector } = this.props
      openWikiPageSelector({
        onSelect: ({ id, title }: WikiPageModel) => {
          this.textRef.value += `~[${title}](${id})`
          this.update()
        }
      })
    }

    private update = () => {
      const { name, value } = this.textRef
      this.textRef.focus()
      this.props.onChange({ name, value })
      this.setState({ value })
    }

    private onRef = (textRef: HTMLTextAreaElement) => {
      if (!this.textRef && textRef) {
        this.textRef = textRef
      }
    }

    public render() {
      const { name, required, rows, className } = this.props

      return (
        <div className={className || ''}>
          {this.renderTools()}
          <textarea
            className="form-control"
            name={name}
            rows={rows}
            required={required}
            onChange={this.update}
            ref={this.onRef}
            value={this.state.value}
          />

          {this.renderPreview()}
        </div>
      )
    }

    private renderTools() {
      return (
        <div className="btn-toolbar m-2" role="toolbar" aria-label="Szövegszerkesztő eszközök">
          <div className="btn-group mr-2" role="group" aria-label="Formázás">
            <Button
              secondary
              onAction={this.wrapText('**', 'félkövér')}
              title="Félkövér"
              icon="bold"
            />
            <Button secondary onAction={this.wrapText('*', 'dőlt')} title="Dőlt" icon="italic" />
            <Button secondary onAction={this.wrapText('$', 'x_1=2')} title="Matematika jelölés">
              $
            </Button>
            <Button
              secondary
              onAction={this.multiLine('$$', 'E=mc^2')}
              title="Többsoros matematika jelölés"
            >
              $$
            </Button>
          </div>
          <div className="btn-group mr-2" role="group" aria-label="Listák">
            <Button
              secondary
              onAction={this.multiLine('* ', 'lista\n')}
              title="Normál lista"
              icon="list-ul"
            />
            <Button
              secondary
              onAction={this.multiLine('1. ', 'számozott lista\n')}
              title="Számozott lista"
              icon="list-ol"
            />
            <Button
              secondary
              onAction={this.multiLine('    ', 'szöveg')}
              title="Behúzás"
              icon="indent"
            />
          </div>
          <div className="btn-group mr-2" role="group" aria-label="Link">
            <Button secondary onAction={this.insertLink('szöveg')} title="Hivatkozás" icon="link" />
            <Button secondary onAction={this.insertWikiLink} title="Wiki" icon="wikipedia-w" />
          </div>
          <div className="btn-group mr-2" role="group" aria-label="Kép">
            <Button secondary onAction={this.insertFile} icon="image">
              Kép beszűrás
            </Button>
          </div>

          <Dropdown className="btn-group mr-2" aria-label="Link">
            <DropdownToggle className="btn btn-secondary text-light">
              <i className="fa fa-question-circle" /> Súgó
            </DropdownToggle>
            <DropdownMenu>
              <Button
                className="btn btn-link text-dark"
                onAction={this.props.openEquationHelpModal}
                icon="calculator"
              >
                Képletszerkesztő
              </Button>
              <Button
                className="btn btn-link text-dark"
                onAction={this.props.openMarkdownHelpModal}
                icon="edit"
              >
                Szövegszerkesztő
              </Button>
            </DropdownMenu>
          </Dropdown>
        </div>
      )
    }

    private renderPreview() {
      return (
        <>
          <div className="mt-2 text-muted">
            <small>Előnézet:</small>
          </div>
          <div className="text-editor-preview form-control disabled">
            <Markdown source={this.state.value} resources={this.props.resources} />
          </div>
        </>
      )
    }
  }
)
