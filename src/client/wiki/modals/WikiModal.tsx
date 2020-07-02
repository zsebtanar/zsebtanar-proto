import React, { useState, useEffect } from 'react'
import { useLoadWikiPage } from '../services/wikiPageService'
import { Dialog, DialogHeader, DialogBody } from 'client/overlay/components'
import { Button, Loading } from 'client/generic/components'
import { Markdown } from 'client/generic/components/markdown'
import { useDialog } from 'client/overlay/providers'
import { WikiPageModel } from 'client/wiki/types'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

///

interface Props {
  pageId: string
}

export function WikiModal({ pageId }: Props) {
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
          icon={faArrowLeft}
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
