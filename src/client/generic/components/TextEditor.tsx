import React, { useState, useRef } from 'react'
import { Button, Dropdown, DropdownToggle, DropdownMenu } from 'client/generic/components/index'
import { useOverlayDispatch } from 'client/overlay/providers'
import { Markdown } from 'client/generic/components/markdown/Markdown'
import { WikiPageSelectorModal } from 'client/wiki/modals/WikiPageSelectorModal'
import { WikiPageModel } from 'client/wiki/types'
import { EquationHelpModal, MarkdownHelpModal } from 'client/generic/modals'
import { ImageBrowserModal } from 'client/file-upload/modals/ImageBrowserModal'
import { RemoteFileResource } from 'client/file-upload/types'
import { MarkdownResources } from 'client/generic/components/markdown/types'

import 'client/generic/components/TextEditor.scss'

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

export function TextEditor({ value, onChange, name, required, rows, className, resources }: Props) {
  const textRef = useRef<HTMLTextAreaElement>(null)
  const [txt, setTxt] = useState<string>(value || '')
  const { openModal } = useOverlayDispatch()

  const wrapText = (token: string, sample = '') => {
    const ref = textRef.current
    if (!ref) return
    const { selectionStart: start, selectionEnd: end, value } = ref

    const noSelection = sample && start === end
    const before = value.slice(0, start)
    const selected = noSelection ? sample : value.slice(start, end)
    const after = value.slice(end)

    ref.value = `${before}${token}${selected}${token}${after}`
    if (noSelection) {
      ref.selectionStart = start + token.length
      ref.selectionEnd = end + sample.length + token.length
    } else {
      ref.selectionEnd = end + token.length
    }
    update()
  }

  const multiLine = (token: string, sample = '') => {
    const ref = textRef.current
    if (!ref) return

    const { selectionStart, selectionEnd: end, value } = ref
    const start = value.lastIndexOf('\n', selectionStart) + 1

    const noSelection = sample && start === end
    const before = value.slice(0, start)
    const text = noSelection ? sample : value.slice(start, end)
    const result = text
      .split('\n')
      .map(x => `${token}${x}`)
      .join('\n')
    const after = value.slice(end)
    ref.value = `${before}${result}${after}`

    if (noSelection) {
      ref.selectionStart = start + token.length
    }
    ref.selectionEnd = end + result.length
    update()
  }

  const insertLink = (sample = '') => {
    const ref = textRef.current
    if (!ref) return

    const { selectionStart: start, selectionEnd: end, value } = ref

    const noSelection = sample && start === end
    const before = value.slice(0, start)
    const selected = noSelection ? sample : value.slice(start, end)
    const after = value.slice(end)
    const url = 'https://example.com'

    ref.value = `${before}[${selected}](${url})${after}`

    ref.selectionStart = start + selected.length + 3
    ref.selectionEnd = ref.selectionStart + url.length
    update()
  }

  const insertFile = () => {
    const ref = textRef.current
    if (!ref) return

    openModal<RemoteFileResource>(<ImageBrowserModal />).then(file => {
      ref.value += `@[${file.name}](${file.id} =100x)`
      update()
    })
  }

  const insertWikiLink = async () => {
    const ref = textRef.current
    if (!ref) return

    const { id, title } = await openModal<WikiPageModel>(<WikiPageSelectorModal />)
    ref.value += `~[${title}](${id})`
    update()
  }

  const update = () => {
    const ref = textRef.current
    if (!ref) return

    const { name, value } = ref
    ref.focus()
    onChange({ name, value })
    setTxt(value)
  }

  return (
    <div className={className || ''}>
      <Tools
        wrapText={wrapText}
        multiLine={multiLine}
        insertLink={insertLink}
        insertWikiLink={insertWikiLink}
        insertFile={insertFile}
      />
      <textarea
        className="form-control"
        name={name}
        rows={rows}
        required={required}
        onChange={update}
        value={txt}
      />

      <Preview value={txt} resources={resources} />
    </div>
  )
}

interface ToolsProps {
  wrapText: (tag: string, sample: string) => void
  multiLine: (tag: string, sample: string) => void
  insertLink: (tag: string) => void
  insertWikiLink: (tag: string) => void
  insertFile: () => void
}

function Tools({ wrapText, multiLine, insertLink, insertWikiLink, insertFile }: ToolsProps) {
  const { openModal } = useOverlayDispatch()

  const openEquationHelpModal = () => {
    openModal(<EquationHelpModal />)
  }

  const openMarkdownHelpModal = () => {
    openModal(<MarkdownHelpModal />)
  }

  return (
    <div className="btn-toolbar m-2" role="toolbar" aria-label="Szövegszerkesztő eszközök">
      <div className="btn-group mr-2" role="group" aria-label="Formázás">
        <Button
          btn="secondary"
          onAction={() => wrapText('**', 'félkövér')}
          title="Félkövér"
          icon="bold"
        />
        <Button btn="secondary" onAction={() => wrapText('*', 'dőlt')} title="Dőlt" icon="italic" />
        <Button btn="secondary" onAction={() => wrapText('$', 'x_1=2')} title="Matematika jelölés">
          $
        </Button>
        <Button
          btn="secondary"
          onAction={() => multiLine('$$', 'E=mc^2')}
          title="Többsoros matematika jelölés"
        >
          $$
        </Button>
      </div>
      <div className="btn-group mr-2" role="group" aria-label="Listák">
        <Button
          btn="secondary"
          onAction={() => multiLine('* ', 'lista\n')}
          title="Normál lista"
          icon="list-ul"
        />
        <Button
          btn="secondary"
          onAction={() => multiLine('1. ', 'számozott lista\n')}
          title="Számozott lista"
          icon="list-ol"
        />
        <Button
          btn="secondary"
          onAction={() => multiLine('    ', 'szöveg')}
          title="Behúzás"
          icon="indent"
        />
      </div>
      <div className="btn-group mr-2" role="group" aria-label="Link">
        <Button
          btn="secondary"
          onAction={() => insertLink('szöveg')}
          title="Hivatkozás"
          icon="link"
        />
        <Button btn="secondary" onAction={() => insertWikiLink} title="Wiki" icon="wikipedia-w" />
      </div>
      <div className="btn-group mr-2" role="group" aria-label="Kép">
        <Button btn="secondary" onAction={() => insertFile()} icon="image">
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
            onAction={openEquationHelpModal}
            icon="calculator"
          >
            Képletszerkesztő
          </Button>
          <Button className="btn btn-link text-dark" onAction={openMarkdownHelpModal} icon="edit">
            Szövegszerkesztő
          </Button>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}

interface PreviewProps {
  value: string
  resources: MarkdownResources
}

function Preview({ value, resources }: PreviewProps) {
  return (
    <>
      <div className="mt-2 text-muted">
        <small>Előnézet:</small>
      </div>
      <div className="text-editor-preview form-control disabled">
        <Markdown source={value} resources={resources} />
      </div>
    </>
  )
}
