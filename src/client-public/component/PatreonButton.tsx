import * as React from 'react'

export function PatreonButton() {
  return (
    <div className="text-center">
      <a href="https://www.patreon.com/bePatron?u=13089371" target="_blank" data-patreon-widget-type="become-patron-button">
				<img
					src="/assets/images/become_a_patron_button.png"
					alt="Become a Patron!"
				/>
			</a>
			<script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>
    </div>
  )
}
