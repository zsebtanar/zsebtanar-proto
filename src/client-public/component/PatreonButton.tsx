import * as React from 'react'
import { ExternalLink } from 'client-common/component/general/ExternalLink'

export function PatreonButton() {
  return (
    <div className="text-center">
			<ExternalLink href="https://www.patreon.com/bePatron?u=13089371">
				<img
					src="/assets/images/become_a_patron_button.png"
					alt="Become a Patron!"
				/>
			</ExternalLink>
    </div>
  )
}
