import React from 'react'
import { ExternalLink } from 'client/generic/components/ExternalLink'

export function PatreonButton(): JSX.Element {
  return (
    <div className="text-center">
      <ExternalLink href="https://www.patreon.com/bePatron?u=13089371" hideIcon>
        <img
          src="/assets/images/become_a_patron_button.png"
          alt="Become a Patron!"
          loading="lazy"
        />
      </ExternalLink>
    </div>
  )
}
