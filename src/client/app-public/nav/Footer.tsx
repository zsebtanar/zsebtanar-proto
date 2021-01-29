import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { FeedbackModal } from '../../feedback/modals/FeedbackModal'
import { useOverlayDispatch } from '../../overlay/providers/OverlayProvider'
import { ExternalLink } from 'client/generic/components/ExternalLink'
import { Button } from 'client/generic/components/Button'

import './Footer.scss'

export function Footer(): JSX.Element {
  const { openModal } = useOverlayDispatch()
  return (
    <footer className="footer container">
      <div className="row justify-content-around">
        <div className="col-md-3 col-lg-2">
          <h5>Rólunk</h5>
          <ul className="list-unstyled">
            <li className="footer-link">
              <NavLink className="text-muted" to="/about">
                Az oldal célja
              </NavLink>
            </li>
            <li className="footer-link">
              <NavLink className="text-muted" to="/joinus">
                Csatlakozz!
              </NavLink>
            </li>
            <li className="footer-link">
              <ExternalLink
                className="text-muted"
                href="http://v1.zsebtanar.hu/"
                title="Zsebtanár 1.0"
              >
                Régi oldal
              </ExternalLink>
            </li>
          </ul>
        </div>
        <div className="col-md-3 col-lg-2">
          <h5>Támogatás</h5>
          <ul className="list-unstyled">
            <li className="footer-link">
              <ExternalLink className="text-muted" href={__CONFIG__.links.policy}>
                Adatvédelem
              </ExternalLink>
            </li>
            <li className="footer-link">
              <NavLink className="text-muted" to="/support">
                Hibaelhárítás
              </NavLink>
            </li>
            <li className="footer-link">
              <Button
                btn="link"
                className="text-muted"
                inline
                onAction={() => openModal(<FeedbackModal />)}
              >
                Visszajelzés
              </Button>
            </li>
          </ul>
        </div>
        <div className="col-md-3 col-lg-2">
          <h5>Média</h5>
          <ul className="list-unstyled">
            <li className="footer-link">
              <ExternalLink
                className="text-muted"
                href="https://www.youtube.com/channel/UC8aqu8qcioAPG_BTMskAcmA"
              >
                YouTube
              </ExternalLink>
            </li>
            <li className="footer-link">
              <ExternalLink className="text-muted" href="https://www.facebook.com/zsebtanar">
                Facebook
              </ExternalLink>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-center footer-copyright">
        &copy; Zsebtanár Nonprofit Alapítvány {new Date().getFullYear()}
      </div>
    </footer>
  )
}
