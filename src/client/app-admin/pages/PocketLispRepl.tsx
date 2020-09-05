import React, { useState, useEffect } from 'react'
import { CodeEditor } from '../../script/components/CodeEditor'
import { PocketLispProvider } from '../../script/providers/PocketLispProvider'
import { TextEditor } from '../../generic/components/form/input/TextEditor'
import { MarkdownWithScript } from '../../script/components/MarkdownWithCode'
import { NumberInput } from '../../generic/components/form/input/NumberInput'
import { FormGroup } from '../../generic/components/form/FormGroup'
import { getItem, setItem } from '../../generic/utils/localStore'

export function PocketLispRepl(): JSX.Element {
  const [seed, setSeed] = useState(1)
  const [script, setScript] = useState('')
  const [desc, setDesc] = useState('')

  useEffect(() => {
    const data = getItem('pl-sandbox', { seed: 1, script: '', desc: '' }, window.localStorage)
    setSeed(data.seed)
    setScript(data.script)
    setDesc(data.desc)
  }, [])

  useEffect(() => {
    const data = getItem('pl-sandbox', { seed: 1, script: '', desc: '' }, window.localStorage)
    if (data.seed !== seed || data.script !== script || data.desc !== desc) {
      setItem('pl-sandbox', { seed, script, desc }, window.localStorage)
    }
  }, [seed, script, desc])

  return (
    <div className="container">
      <h1>Pocket lisp sandbox</h1>
      <FormGroup label="Seed">
        {(id) => (
          <NumberInput
            id={id}
            onChange={({ value }) => setSeed(value)}
            name="seed"
            value={seed}
            min={1}
            step={1}
            max={Number.MAX_SAFE_INTEGER}
          />
        )}
      </FormGroup>
      <PocketLispProvider isEdit={true} seed={seed} script={script}>
        <FormGroup label="Script">
          {(id) => (
            <CodeEditor
              id={id}
              name="editor"
              onChange={({ value }) => setScript(value)}
              value={script}
            />
          )}
        </FormGroup>
        <FormGroup label="Test text">
          {(id) => (
            <TextEditor
              id={id}
              preview={MarkdownWithScript}
              name="text"
              onChange={({ value }) => setDesc(value)}
              value={desc}
            />
          )}
        </FormGroup>
      </PocketLispProvider>
    </div>
  )
}
