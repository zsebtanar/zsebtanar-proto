import React, { useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import * as CodeMirror from 'codemirror'
import { usePocketLisp } from '../providers/PocketLispProvider'
import debounce from '../../generic/utils/debounce'
import { UseModelProps } from '../../generic/hooks/model'

// plugins
import 'codemirror/mode/clojure/clojure'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/hint/show-hint'

// style
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/lib/codemirror.css'
import './CodeEditor.scss'

interface Props extends UseModelProps<string> {
  id?: string
  className?: string
}

///

export function CodeEditor({ className, onChange, name, value, ...props }: Props): JSX.Element {
  const interpreter = usePocketLisp()
  const textAreaEl = useRef<HTMLTextAreaElement>(null)
  const [cm, setCodeMirror] = useState<CodeMirror.EditorFromTextArea>()

  // Init CodeMirror
  useEffect(() => {
    if (!textAreaEl?.current) return

    const codeMirror = CodeMirror.fromTextArea(textAreaEl.current, {
      lineNumbers: true,
      mode: 'text/x-clojure',
      extraKeys: { 'Ctrl-Space': 'autocomplete' },
      lineWrapping: true,
      autoCloseBrackets: true,
      matchBrackets: true,
      viewportMargin: Infinity,
    })
    codeMirror['__interpreterWidgets'] = []

    setCodeMirror(codeMirror)
    return () => codeMirror.toTextArea()
  }, [textAreaEl])

  useEffect(() => {
    if (cm && cm.getValue() !== value) {
      cm.setValue(value ?? '')
    }
  }, [cm, value])

  // Setup codeMirror event listeners
  useEffect(() => {
    if (!cm) return
    const onChangeHandler = debounce((cm) => {
      const value = cm.getValue()
      onChange({ name, value })
      const widgets = cm['__interpreterWidgets']
      cm.doc.getAllMarks().forEach((m) => m.clear())
      widgets.forEach((w) => w.clear())
      widgets.length = 0
      interpreter.getOutput().forEach(({ msg, position, type }) => {
        if (position) {
          if (type === 'error') {
            const mFrom = cm.doc.posFromIndex(position.startIndex)
            const mTo = cm.doc.posFromIndex(position.endIndex)
            cm.doc.markText(mFrom, mTo, { className: 'syntax-error', title: msg })

            widgets.push(
              cm.doc.addLineWidget(position.line - 1, createErrorWidget('error', msg), {
                coverGutter: false,
              }),
            )
          } else if (type === 'normal') {
            widgets.push(
              cm.doc.addLineWidget((position?.line ?? 1) - 1, createErrorWidget('log', msg), {
                coverGutter: false,
              }),
            )
          }
        }
      })
    }, 150)

    cm.on('change', onChangeHandler)
    cm.setOption('hintOptions', { hint: codeCompletion(interpreter) })

    return () => cm.off('change', onChangeHandler)
  }, [cm, interpreter, name, onChange])

  return (
    <div className={cx('code-editor', className)}>
      <textarea ref={textAreaEl} name={name} className="border" defaultValue={value} {...props} />
    </div>
  )
}

const codeCompletion = (interpreter) => {
  return (cm) => {
    const cursor = cm.getCursor()
    const line = cm.getLine(cursor.line)
    let start = cursor.ch
    const end = cursor.ch

    while (start && /\w/.test(line.charAt(start - 1))) --start
    const word = line.slice(start, end).toLowerCase()

    return {
      list: interpreter.getGlobalNames().filter((name) => name.includes(word)),
      from: CodeMirror.Pos(cursor.line, start),
      to: CodeMirror.Pos(cursor.line, end),
    }
  }
}

const createErrorWidget = (type: 'error' | 'log', message: string) => {
  const node = document.createElement('div')
  const icon = node.appendChild(document.createElement('span'))
  node.appendChild(document.createTextNode(message))

  if (type === 'error') {
    icon.innerHTML = '!'
    icon.className = 'code-icon code-error-icon'
    node.className = 'code-error'
  } else if (type === 'log') {
    icon.innerHTML = '▸'
    icon.className = 'code-icon code-log-icon'
    node.className = 'code-log'
  }
  return node
}
