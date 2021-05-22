import * as React from 'react'
import { AlertModal } from 'client/overlay/components/AlertModal'
import { ExternalLink } from 'client/generic/components/ExternalLink'

export function CookieModal(): JSX.Element {
  return (
    <AlertModal title="Értesítés a sütik használatáról">
      <div>
        <h6>
          <b>Mik azok a cookiek?</b>
        </h6>

        <p>
          A süti (eredeti nevén “cookie”) egy olyan kis adatcsomag, amit az internetes
          szolgáltatások a böngészőben tárolnak el. Ez rengeteg webes szolgáltatás működéséhez
          elengedhetetlen technológia, amit 1995 óta minden jelentősebb böngésző támogat.
        </p>

        <h6>
          <b>Miért jók nekem?</b>
        </h6>

        <p>
          Számtalan internetes szolgáltatás használata múlik a sütiken. Ennek segítségével tudsz
          például bejelentkezni vagy éppen személyre szabott tartalmat elérni a neten.
        </p>

        <h6>
          <b>Sütik (cookie-k) a weboldalon</b>
        </h6>

        <p>
          A weboldalunk minél magasabb színvonalú működésének biztosítása és a felhasználói élmény
          növelése érdekében sütiket („cookie”) használunk. A cookiet számítógépedről bármikor
          törölheted, illetve beállíthatod a böngésződ úgy, hogy a cookiek alkalmazását tiltsa. A
          cookiek alkalmazásának tiltásával azonban tudomásul veszed, hogy cookie nélkül az oldal
          működése nem lesz teljes értékű. A cookiek alkalmazásáról tájékozódhatsz az{' '}
          <ExternalLink href={__CONFIG__.links.policy}>adatkezelési szabályzatban</ExternalLink>
        </p>
      </div>
    </AlertModal>
  )
}
