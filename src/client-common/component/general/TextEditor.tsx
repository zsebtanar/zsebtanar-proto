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
import { WikiPageModel } from '../../services/wikiPageService'
import { DropdownMenu } from './dropdown/DropdownMenu'
import { DropdownToggle } from './dropdown/DropdownToggle'

import './TextEditor.scss'

///

interface Props {
  value: string
  name: string
  className?: string
  row?: number
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

export const TextEditor = connect(
  undefined,
  {
    openExerciseImageDialog,
    openMarkdownHelpModal,
    openEquationHelpModal,
    openWikiPageSelector
  }
)(
  class extends React.Component<AllProps, State> {
    private textRef

    constructor(props) {
      super(props)
      this.state = { value: props.value || '' }
    }

    private wrapText = char => () => {
      const { selectionStart: start, selectionEnd: end, value } = this.textRef
      this.textRef.value = `${value.slice(0, start)}${char}${value.slice(
        start,
        end
      )}${char}${value.slice(end)}`
      this.update()
    }

    private multiLine = char => () => {
      const { selectionStart, selectionEnd: end, value } = this.textRef
      const start = value.lastIndexOf('\n', selectionStart) + 1
      const sStart = value.slice(0, start)
      const text = value
        .slice(start, end)
        .split('\n')
        .map(x => `${char}${x}`)
        .join('\n')
      const sEnd = value.slice(end)
      this.textRef.value = `${sStart}${text}${sEnd}`
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
      const { openWikiPageSelector } = this.props;
      openWikiPageSelector({
        onSelect: ({id, title}: WikiPageModel) => {
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

    private onRef = textRef => {
      this.textRef = textRef
    }

    public render() {
      const { name, required, row, className } = this.props

      return (
        <div className={className || ''}>
          {this.renderTools()}
          <textarea
            className="form-control"
            name={name}
            rows={row || 10}
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
            <Button secondary onAction={this.wrapText('**')} title="Félkövér" icon="bold" />
            <Button secondary onAction={this.wrapText('*')} title="Dőlt" icon="italic" />
            <Button
              secondary
              onAction={this.wrapText('~~')}
              title="Áthúzott"
              icon="strikethrough"
            />
            <Button secondary onAction={this.wrapText('$')} title="Matematika jelölés" icon="usd" />
          </div>
          <div className="btn-group mr-2" role="group" aria-label="Listák">
            <Button secondary onAction={this.multiLine('* ')} title="Normál lista" icon="list-ul" />
            <Button
              secondary
              onAction={this.multiLine('1. ')}
              title="Számozott lista"
              icon="list-ol"
            />
            <Button secondary onAction={this.multiLine('    ')} title="Behúzás" icon="indent" />
          </div>
          <div className="btn-group mr-2" role="group" aria-label="Link">
            <Button secondary onAction={this.multiLine('')} title="Hivatkozás" icon="link" />
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
