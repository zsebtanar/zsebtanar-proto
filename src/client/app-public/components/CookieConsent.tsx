import React, { useState, useEffect } from 'react'
import { ExternalLink, Button } from 'client/generic/components'
import { useOverlayDispatch } from 'client/overlay/providers'

import { CookieModal } from '../modals/CookieModal'

const CONSENT_KEY = 'zsebtanar-consent-accepted'

export function CookieConsent() {
  const [isAccepted, setCookieConsent] = useState<boolean>(true)
  const { openModal } = useOverlayDispatch()

  useEffect(() => {
    const currentValue = window.localStorage.getItem(CONSENT_KEY)
    setCookieConsent(currentValue === 'true')
  }, [])

  const accept = () => {
    window.localStorage.setItem(CONSENT_KEY, 'true')
    setCookieConsent(true)
  }

  if (isAccepted) return

  return (
    <div className="cookie-consent p-2">
      <div className="container">
        <div className="row">
          <div className="col-md-9 col-sm-12 mb-2">
            <ExternalLink href={__CONFIG__.links.policy}>Adatvédelmi tájékoztatónkban</ExternalLink>{' '}
            megtalálod, hogyan gondoskodunk adataid védelméről. Oldalunkon HTTP-sütiket használunk a
            jobb működésért.{' '}
            <a onClick={() => openModal(<CookieModal />)} href="#">
              További információk
            </a>
          </div>
          <div className="col-md-3 col-sm-10 offset-sm-1 offset-md-0">
            <Button className="btn btn-warning w-100" onAction={accept}>
              Rendben
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
