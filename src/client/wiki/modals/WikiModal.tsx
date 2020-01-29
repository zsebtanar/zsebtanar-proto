import React, { useState, useEffect } from 'react'
import { useLoadWikiPage } from '../services/wikiPageService'
import { Dialog, DialogHeader, DialogBody } from 'client/overlay/components'
import { Button, Loading } from 'client/generic/components'
import { Markdown } from 'client/markdown/components'
import { useDialog } from 'client/overlay/providers'
import { WikiPageModel } from 'client/wiki/types'

import './WikiModal.scss'

///

interface Props {
  pageId: string
}

export function WikiModal({ pageId }: Props) {
  const { closeDialog } = useDialog()

  const [nextPageId, setNextPageId] = useState<string>(pageId)
  const [activePage, setActivePage] = useState<number>(0)
  const [history, setHistory] = useState<WikiPageModel[]>([])

  const state = useLoadWikiPage(nextPageId)

  useEffect(() => {
    if (state.result !== undefined) {
      setHistory([...history, state.result])
    }
  }, [state.result])

  const page = history[activePage]

  const navForward = (pageId: string) => {
    setActivePage(activePage + 1)
    setNextPageId(pageId)
  }

  const navBackward = () => setActivePage(activePage - 1)

  return (
    <Dialog className="wiki-modal">
      <DialogHeader onClose={closeDialog}>
        <Button
          className="btn-sm btn-light nav-back"
          icon="arrow-left"
          onAction={navBackward}
          disabled={activePage === 0}
        />
        {(page && page.title) || ''}
      </DialogHeader>
      <DialogBody>
        <div className="list-group">
          {state.loading && <Loading />}
          {state.loading && (
            <Markdown source={page.content} resources={page.resources} onWikiLink={navForward} />
          )}
        </div>
      </DialogBody>
    </Dialog>
  )
}
