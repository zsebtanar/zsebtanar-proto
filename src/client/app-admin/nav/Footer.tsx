import React from 'react'
import { Button } from 'client/generic/components'
import { FeedbackModal } from 'client/feedback/modals/FeedbackModal'
import { useOverlayDispatch } from 'client/overlay/providers'

export function Footer() {
  const { openModal } = useOverlayDispatch()

  return (
    <footer className="footer">
      <p>
        &copy; Zsebtanár Nonprofit Alapítvány {new Date().getFullYear()}
        {' - '}
        <Button btn="link" inline onAction={() => openModal(<FeedbackModal />)}>
          Visszajelzés
        </Button>
      </p>
    </footer>
  )
}
