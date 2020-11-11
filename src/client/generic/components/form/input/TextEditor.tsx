import React, { useState, useRef, useCallback } from 'react'
import cx from 'classnames'
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  List as ListIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  HelpCircle as HelpCircleIcon,
  Edit as EditIcon,
  DollarSign as DollarSignIcon,
} from 'react-feather'
import { AssetModel } from 'shared/assets/types'
import { Markdown } from 'client/generic/components/markdown/Markdown'
import { WikiPageSelectorModal } from 'client/wiki/modals/WikiPageSelectorModal'
import { WikiPageModel } from 'client/wiki/types'
import { MarkdownProps } from 'client/generic/components/markdown/types'
import { UseModelProps } from '../../../hooks/model'
import { AssetBrowserModal } from 'client/asset/modals/AssetBrowserModal'
import { FocusGuard } from '../../FocusGuard'
import { useOverlayDispatch } from 'client/overlay/providers/OverlayProvider'
import { EquationHelpModal } from 'client/generic/modals/EquationHelpModal'
import { Button } from '../../Button'
import { MarkdownHelpModal } from 'client/generic/modals/MarkdownHelpModal'
import { Dropdown } from '../../dropdown/Dropdown'
import { DropdownToggle } from '../../dropdown/DropdownToggle'
import { DropdownMenu } from '../../dropdown/DropdownMenu'
import { Icon } from '../../icons/Icon'

import 'client/generic/components/form/input/TextEditor.scss'

///

interface Props extends UseModelProps<string> {
  id?: string
  className?: string
  rows?: number
  required?: boolean
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
  preview: Preview,
}: Props): JSX.Element {
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
      .map((x) => `${token}${x}`)
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

    openModal<AssetModel>(<AssetBrowserModal />).then((file) => {
      if (file) {
        ref.value += `@[${file.fileName}](${file.url} =100x)`
        update()
      }
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
  }

  const onFocus = useCallback(() => setIsInFocus(true), [])
  const onBlur = useCallback(() => setIsInFocus(false), [])

  return (
    <FocusGuard onFocus={onFocus} onBlur={onBlur}>
      <div className={cx(className, 'text-editor', 'form-control', { focused: isInFocus })}>
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
        />
        <div className="text-editor-preview">
          {Preview ? <Preview source={value} /> : <Markdown source={value} />}
        </div>
      </div>
    </FocusGuard>
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
          icon={BoldIcon}
        />
        <Button btn="light" onAction={() => wrapText('*', 'dőlt')} title="Dőlt" icon={ItalicIcon} />
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
          icon={ListIcon}
        />
        <Button
          btn="light"
          onAction={() => multiLine('1. ', 'számozott lista\n')}
          title="Számozott lista"
          icon={ListIcon}
        />
      </div>
      <div className="btn-group btn-group-sm mr-2" role="group" aria-label="Link">
        <Button
          btn="light"
          onAction={() => insertLink('szöveg')}
          title="Hivatkozás"
          icon={LinkIcon}
        />
        <Button btn="light" onAction={() => insertWikiLink} title="Wiki">
          Wiki
        </Button>
      </div>
      <div className="btn-group btn-group-sm mr-2" role="group" aria-label="Kép">
        <Button btn="light" onAction={() => insertFile()} icon={ImageIcon}>
          Kép beszűrás
        </Button>
      </div>

      <Dropdown className="btn-group btn-group-sm mr-2" aria-label="Link">
        <DropdownToggle className="btn btn-light text-light">
          <Icon icon={HelpCircleIcon} /> Súgó
        </DropdownToggle>
        <DropdownMenu>
          <Button
            className="btn btn-link text-dark"
            onAction={openEquationHelpModal}
            icon={DollarSignIcon}
          >
            Képletszerkesztő
          </Button>
          <Button
            className="btn btn-link text-dark"
            onAction={openMarkdownHelpModal}
            icon={EditIcon}
          >
            Szövegszerkesztő
          </Button>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}
