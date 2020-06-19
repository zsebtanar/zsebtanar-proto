import React, { useEffect, useRef, useState } from 'react'
import * as cx from 'classnames'
import * as CodeMirror from 'codemirror'
import { usePocketLisp, InterpreterOutput } from '../providers/PocketLispProvider'
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

export function CodeEditor({ className, onChange, name, value, ...props }: Props) {
  const interpreter = usePocketLisp()
  const textAreaEl = useRef<HTMLTextAreaElement>(null)
  const [cm, setCodeMirror] = useState<CodeMirror.EditorFromTextArea>()
  const [output, setOutput] = useState<InterpreterOutput[]>([])

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
      viewportMargin: Infinity
    })

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
    const onChangeHandler = debounce(cm => {
      const value = cm.getValue()
      onChange({ name, value })
      setOutput(interpreter.getOutput())
    }, 150)

    cm.on('change', onChangeHandler)
    cm.setOption('hintOptions', { hint: codeCompletion(interpreter) })

    return () => cm.off('change', onChangeHandler)
  }, [cm, interpreter, name, onChange])

  return (
    <div className={cx('code-editor', className)}>
      <div className="row">
        <div className="col-md-6">
          <textarea
            ref={textAreaEl}
            name={name}
            className="border"
            defaultValue={value}
            {...props}
          />
        </div>
        <div className="col-md-6">
          <pre className="output border rounded-sm">
            {output.map(({ type, msg }, idx) => (
              <div key={idx} className={type}>
                {msg}
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
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
