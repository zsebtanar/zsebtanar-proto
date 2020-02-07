import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { ExternalLink, Button } from 'client/generic/components'
import { useOverlayDispatch } from 'client/overlay/providers'
import { FeedbackModal } from 'client/feedback/modals/FeedbackModal'

import 'client/app-public/nav/Footer.scss'

export function Footer() {
  const { openModal } = useOverlayDispatch()
  return (
    <footer className="footer">
      <p>
        <NavLink to="/about">Rólunk</NavLink>
        {' - '}
        <NavLink to="/joinus">Csatlakozz!</NavLink>
        {' - '}
        <ExternalLink href={__CONFIG__.links.policy}>Adatvédelem</ExternalLink>
        {' - '}
        <Button btn="link" inline onAction={() => openModal(<FeedbackModal />)}>
          Visszajelzés
        </Button>
        {' - '}
        <NavLink to="/support">Hibaelhárítás</NavLink>
        {' - '}
        <ExternalLink href="https://www.facebook.com/zsebtanar">Facebook</ExternalLink>
        {' - '}
        <ExternalLink href="http://v1.zsebtanar.hu/" title="Zsebtanár 1.0">
          Régi oldal
        </ExternalLink>
      </p>
      <p>
        &copy; Zsebtanár Nonprofit Alapítvány {new Date().getFullYear()}
      </p>
    </footer>
  )
}
