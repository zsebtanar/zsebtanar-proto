import * as React from 'react'
import * as cx from 'classnames'
import * as CodeMirror from 'codemirror'
import { useEffect, useRef, useState } from 'react'
import { usePocketLisp } from 'client/generator/PocketLispProvider'

import 'codemirror/mode/clojure/clojure'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/hint/show-hint'

import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/lib/codemirror.css'
import './CodeEditor.scss'

interface Props {
  className?: string
  name: string
  onChange: (event: { name: string, value: string }) => void
  value: string
}

///

export function CodeEditor({ className, onChange, name, value }: Props) {
  const interpreter = usePocketLisp()
  const textAreaEl = useRef<HTMLTextAreaElement>(null)
  const [cm, setCodeMirror] = useState<CodeMirror.EditorFromTextArea>()

  useEffect(
    () => {
      if (!(textAreaEl?.current) || cm) return

      const codeMirror = CodeMirror.fromTextArea(textAreaEl.current, {
        lineNumbers: true,
        mode: 'text/x-clojure',
        extraKeys: { 'Ctrl-Space': 'autocomplete' },
        lineWrapping: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        hintOptions: { hint: codeCompletion(interpreter) }
      })

      codeMirror.on('change', (cm) => onChange({ name, value: cm.getValue() }))

      setCodeMirror(codeMirror)
    },
    [name, onChange, textAreaEl.current]
  )

  const run = async () => {
    const src = cm?.getValue() ?? ''
    interpreter.run(src)
  }

  return (
    <form className={cx('code-editor', className)}>
      <div className="row">
        <div className="col-md-6 my-3">
          <textarea
            ref={textAreaEl}
            name={name}
            id="code"
            cols={30}
            rows={10}
            className="border"
            defaultValue={value}
          />
          <div>
            <button type="button" className="btn btn-primary mt-2" onClick={run}>
              Futtatás
            </button>
          </div>
        </div>
        <div className="col-md-6 my-3">
          <pre className="output border rounded-sm">
            {interpreter.getOutput().map(({ type, msg }, idx) => (
              <div key={idx} className={type}>
                {msg}
              </div>
            ))}
          </pre>
        </div>
      </div>
    </form>
  )
}

const codeCompletion = interpreter => {
  return cm => {
    const cursor = cm.getCursor()
    const line = cm.getLine(cursor.line)
    let start = cursor.ch
    const end = cursor.ch

    while (start && /\w/.test(line.charAt(start - 1))) --start
    const word = line.slice(start, end).toLowerCase()

    return {
      list: interpreter.getGlobalNames().filter(name => name.includes(word)),
      from: CodeMirror.Pos(cursor.line, start),
      to: CodeMirror.Pos(cursor.line, end)
    }
  }
}
