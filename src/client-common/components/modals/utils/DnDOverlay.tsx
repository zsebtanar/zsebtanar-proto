import React, { useState, useCallback } from 'react'
import { useDocumentEvent } from '../../../hooks/events'

const PREVENTED_EVENT = [
  'drag',
  'dragstart',
  'dragend',
  'dragover',
  'dragenter',
  'dragleave',
  'drop'
] as const

export function DnDOverlay() {
  const [counter, setCounter] = useState(0)

  const addClass = useCallback(() => {
    setCounter(counter + 1)
    document.body.classList.add('is-dragover')
  }, [])

  const removeClass = useCallback(e => {
    setCounter(counter - 1)
    if (e.type === 'drop') setCounter(0)
    if (!counter) {
      document.body.classList.remove('is-dragover')
    }
  }, [])

  const prevent = useCallback(e => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  PREVENTED_EVENT.map(eventName => useDocumentEvent(eventName, prevent))
  useDocumentEvent('dragover', addClass)
  useDocumentEvent('dragenter', addClass)
  useDocumentEvent('dragleave', removeClass)
  useDocumentEvent('dragend', removeClass)
  useDocumentEvent('drop', removeClass)

  return (
    <div className="dnd-overlay">
      <div className="msg-block">
        <div className="block-item">
          <i className="fa fa-upload fa-5x" />
          <br />
          <br />
          Csak dobd ide a feltöltendő fájlokat.
        </div>
      </div>
    </div>
  )
}
