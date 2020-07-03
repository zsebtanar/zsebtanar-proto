import React from 'react'
import { useLoadWikiPages } from '../services/wikiPageService'
import { useDialog } from '../../overlay/providers/DialogProvider'
import { Dialog } from 'client/overlay/components/base/Dialog'
import { DialogHeader } from 'client/overlay/components/base/DialogHeader'
import { Alert } from 'client/generic/components/Alert'
import { Loading } from 'client/generic/components/Loading'
import { DialogBody } from 'client/overlay/components/base/DialogBody'

///

export function WikiPageSelectorModal(): JSX.Element {
  const { isPending, isLoading, hasNoResult, result } = useLoadWikiPages()
  const { closeModal } = useDialog()

  const selectPage = (page) => {
    closeModal(page)
  }

  return (
    <Dialog className="confirm">
      <DialogHeader onClose={closeModal}>Wiki oldalak</DialogHeader>
      <DialogBody>
        <div className="list-group">
          {isPending || (isLoading && <Loading />)}
          {hasNoResult && <Alert type={'info'}>Nincs találat</Alert>}
          {result &&
            result.map((item) => (
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
