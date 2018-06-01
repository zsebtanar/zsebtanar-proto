import React from 'react'
import { Button } from '../general/Button'

export function CookieModal (props) {
  return (
    <div className="modal-dialog modal-lg" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Értesítés a sütik használatáról</h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Bezárás"
            onClick={props.close}
          >
            <span aria-hidden={true}>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <h6><b>Mik azok a cookiek?</b></h6>

          <p>A süti (eredeti nevén “cookie”) egy olyan kis adatcsomag, amit az internetes szolgáltatások a böngészőben tárolnak el. Ez rengeteg webes szolgáltatás működéséhez elengedhetetlen technológia, amit 1995 óta minden jelentősebb böngésző támogat.</p>

          <h6><b>Miért jók nekem?</b></h6>

          <p>Számtalan internetes szolgáltatás használata múlik a sütiken. Ennek segítségével tudsz például bejelentkezni vagy éppen személyre szabott tartalmat elérni a neten.</p>

          <h6><b>Sütik (cookie-k) a weboldalon</b></h6>

          <p>A weboldalunk minél magasabb színvonalú működésének biztosítása és a felhasználói élmény növelése érdekében sütiket („cookie”) használunk. A cookiet számítógépedről bármikor törölheted, illetve beállíthatod a böngésződ úgy, hogy a cookiek alkalmazását tiltsa. A cookiek alkalmazásának tiltásával azonban tudomásul veszed, hogy cookie nélkül az oldal működése nem lesz teljes értékű. A cookiek alkalmazásáról tájékozódhatsz az <a href="https://firebasestorage.googleapis.com/v0/b/zsebtanar-prod.appspot.com/o/docs%2Fzsebtanar-adatvedelmi-szabalyzat-2018.pdf?alt=media&amp;token=3cd16e18-51bc-4069-af98-051df97f2fe6" target="_blank">adatkezelési szabályzatban</a>.</p>
        </div>
        <div className="modal-footer text-center">
          <Button onAction={props.close}>Bezár</Button>
        </div>
      </div>
    </div>
  )
}
