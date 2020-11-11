import React, { useState, useCallback } from 'react'
import { Upload as UploadIcon } from 'react-feather'
import { useDocumentEvent } from 'client/generic/hooks/events'

export function DnDOverlay(): JSX.Element {
  const [counter, setCounter] = useState(0)

  const addClass = useCallback(() => {
    setCounter(counter + 1)
    document.body.classList.add('is-dragover')
  }, [])

  const removeClass = useCallback((e) => {
    setCounter(counter - 1)
    if (e.type === 'drop') setCounter(0)
    if (!counter) {
      document.body.classList.remove('is-dragover')
    }
  }, [])

  const prevent = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  // prevent envents
  useDocumentEvent('drag', prevent)
  useDocumentEvent('dragstart', prevent)
  useDocumentEvent('dragend', prevent)
  useDocumentEvent('dragover', prevent)
  useDocumentEvent('dragenter', prevent)
  useDocumentEvent('dragleave', prevent)
  useDocumentEvent('drop', prevent)

  useDocumentEvent('dragover', addClass)
  useDocumentEvent('dragenter', addClass)
  useDocumentEvent('dragleave', removeClass)
  useDocumentEvent('dragend', removeClass)
  useDocumentEvent('drop', removeClass)

  return (
    <div className="dnd-overlay">
      <div className="msg-block">
        <div className="block-item">
          <UploadIcon size={128} />
          <br />
          <br />
          Csak dobd ide a feltöltendő fájlokat.
        </div>
      </div>
    </div>
  )
}
