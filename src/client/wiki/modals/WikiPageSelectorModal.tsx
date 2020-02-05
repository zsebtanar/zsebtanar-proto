import React from 'react'
import { useLoadWikiPages } from '../services/wikiPageService'
import { useDialog } from 'client/overlay/providers'
import { Dialog, DialogHeader, DialogBody } from 'client/overlay/components/base'
import { Loading, Alert } from 'client/generic/components'

///

export function WikiPageSelectorModal() {
  const state = useLoadWikiPages()
  const { closeModal } = useDialog()

  const selectPage = page => {
    closeModal(page)
  }

  return (
    <Dialog className="confirm">
      <DialogHeader onClose={closeModal}>Wiki oldalak</DialogHeader>
      <DialogBody>
        <div className="list-group">
          {state.loading && <Loading />}
          {state.isEmpty && <Alert type={'info'}>Nincs találat</Alert>}
          {state.result &&
            state.result.map(item => (
              <button
                key={item.id}
                className="list-group-item list-group-item-action"
                onClick={() => selectPage(item)}
              >
                {item.title}
              </button>
            ))}
        </div>
      </DialogBody>
    </Dialog>
  )
}
