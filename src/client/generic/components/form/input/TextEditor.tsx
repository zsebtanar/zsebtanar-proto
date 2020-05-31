import React, { useState, useRef } from 'react'
import * as cx from 'classnames'
import { Button, Dropdown, DropdownToggle, DropdownMenu } from 'client/generic/components/index'
import { useOverlayDispatch } from 'client/overlay/providers'
import { Markdown } from 'client/generic/components/markdown/Markdown'
import { WikiPageSelectorModal } from 'client/wiki/modals/WikiPageSelectorModal'
import { WikiPageModel } from 'client/wiki/types'
import { EquationHelpModal, MarkdownHelpModal } from 'client/generic/modals'
import { ImageBrowserModal } from 'client/file-upload/modals/ImageBrowserModal'
import { RemoteFileResource } from 'client/file-upload/types'
import { MarkdownResources, MarkdownProps } from 'client/generic/components/markdown/types'

import 'client/generic/components/form/input/TextEditor.scss'
import {
  faBold,
  faItalic,
  faListUl,
  faListOl,
  faIndent,
  faLink,
  faImage,
  faCalculator,
  faEdit,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons'
import { faWikipediaW } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

///

interface Props {
  id?: string
  value: string
  name: string
  className?: string
  rows?: number
  required?: boolean
  resources: MarkdownResources
  onChange: (name: string, value: string) => void
  preview?: React.FunctionComponent<MarkdownProps>
}

export function TextEditor({
  id,
  value,
  onChange,
  name,
  required,
  rows,
  className,
  resources,
  preview: Preview
}: Props) {
  const textRef = useRef<HTMLTextAreaElement>(null)
  const [isInFocus, setIsInFocus] = useState<boolean>(false)
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
    onChange(name, value)
  }

  return (
    <div
      className={cx(className, 'text-editor', 'form-control', { focused: isInFocus })}
      onClick={() => textRef.current?.focus()}
    >
      {isInFocus && (
        <Tools
          wrapText={wrapText}
          multiLine={multiLine}
          insertLink={insertLink}
          insertWikiLink={insertWikiLink}
          insertFile={insertFile}
        />
      )}{' '}
      <textarea
        id={id}
        className={cx({ 'form-control': isInFocus })}
        ref={textRef}
        name={name}
        rows={rows || 4}
        required={required}
        onChange={update}
        value={value}
        onFocus={() => setIsInFocus(true)}
        onBlur={() => setIsInFocus(false)}
      />
      <div className="text-editor-preview">
        {Preview ? (
          <Preview source={value} resources={resources} />
        ) : (
          <Markdown source={value} resources={resources} />
        )}
      </div>
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
    <div className="btn-toolbar" role="toolbar" aria-label="Szövegszerkesztő eszközök">
      <div className="btn-group btn-group-sm mr-2" role="group" aria-label="Formázás">
        <Button
          btn="light"
          onAction={() => wrapText('**', 'félkövér')}
          title="Félkövér"
          icon={faBold}
        />
        <Button btn="light" onAction={() => wrapText('*', 'dőlt')} title="Dőlt" icon={faItalic} />
        <Button btn="light" onAction={() => wrapText('$', 'x_1=2')} title="Matematika jelölés">
          $
        </Button>
        <Button
          btn="light"
          onAction={() => multiLine('$$', 'E=mc^2')}
          title="Többsoros matematika jelölés"
        >
          $$
        </Button>
      </div>
      <div className="btn-group btn-group-sm mr-2" role="group" aria-label="Listák">
        <Button
          btn="light"
          onAction={() => multiLine('* ', 'lista\n')}
          title="Normál lista"
          icon={faListUl}
        />
        <Button
          btn="light"
          onAction={() => multiLine('1. ', 'számozott lista\n')}
          title="Számozott lista"
          icon={faListOl}
        />
        <Button
          btn="light"
          onAction={() => multiLine('    ', 'szöveg')}
          title="Behúzás"
          icon={faIndent}
        />
      </div>
      <div className="btn-group btn-group-sm mr-2" role="group" aria-label="Link">
        <Button
          btn="light"
          onAction={() => insertLink('szöveg')}
          title="Hivatkozás"
          icon={faLink}
        />
        <Button btn="light" onAction={() => insertWikiLink} title="Wiki" icon={faWikipediaW} />
      </div>
      <div className="btn-group btn-group-sm mr-2" role="group" aria-label="Kép">
        <Button btn="light" onAction={() => insertFile()} icon={faImage}>
          Kép beszűrás
        </Button>
      </div>

      <Dropdown className="btn-group btn-group-sm mr-2" aria-label="Link">
        <DropdownToggle className="btn btn-light text-light">
          <FontAwesomeIcon icon={faQuestionCircle} /> Súgó
        </DropdownToggle>
        <DropdownMenu>
          <Button
            className="btn btn-link text-dark"
            onAction={openEquationHelpModal}
            icon={faCalculator}
          >
            Képletszerkesztő
          </Button>
          <Button className="btn btn-link text-dark" onAction={openMarkdownHelpModal} icon={faEdit}>
            Szövegszerkesztő
          </Button>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}
