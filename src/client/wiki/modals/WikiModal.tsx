import React, { useState, useEffect } from 'react'
import { useLoadWikiPage } from '../services/wikiPageService'
import { WikiPageModel } from 'client/wiki/types'
import { ArrowLeft as ArrowLeftIcon } from 'react-feather'
import { useDialog } from '../../overlay/providers/DialogProvider'
import { Dialog } from 'client/overlay/components/base/Dialog'
import { Button } from 'client/generic/components/Button'
import { DialogHeader } from 'client/overlay/components/base/DialogHeader'
import { DialogBody } from 'client/overlay/components/base/DialogBody'
import { Loading } from 'client/generic/components/Loading'
import { Markdown } from 'client/generic/components/markdown/Markdown'

///

interface Props {
  pageId: string
}

export function WikiModal({ pageId }: Props): JSX.Element {
  const { closeModal } = useDialog()

  const [nextPageId, setNextPageId] = useState<string>(pageId)
  const [activePage, setActivePage] = useState<number>(0)
  const [history, setHistory] = useState<WikiPageModel[]>([])

  const { isPending, isSuccess, isLoading, result } = useLoadWikiPage(nextPageId)

  useEffect(() => {
    if (result !== undefined) {
      setHistory([...history, result])
    }
  }, [history, result])

  const page = history[activePage]

  const navForward = (pageId: string) => {
    setActivePage(activePage + 1)
    setNextPageId(pageId)
  }

  const navBackward = () => setActivePage(activePage - 1)

  return (
    <Dialog className="wiki-modal">
      <DialogHeader onClose={closeModal}>
        <Button
          className="btn-sm btn-light nav-back"
          icon={ArrowLeftIcon}
          onAction={navBackward}
          disabled={activePage === 0}
        />
        {(page && page.title) || ''}
      </DialogHeader>
      <DialogBody>
        <div className="list-group">
          {isPending || (isLoading && <Loading />)}
          {isSuccess && <Markdown source={page.content} onWikiLink={navForward} />}
        </div>
      </DialogBody>
    </Dialog>
  )
}
