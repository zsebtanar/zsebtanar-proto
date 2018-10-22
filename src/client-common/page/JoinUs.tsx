import * as React from 'react'
import { withTracker } from '../component/hoc/withTracker'
import { ExternalLink } from '../component/general/ExternalLink'

export const JoinUs = withTracker(function JoinUsPage() {
  return (
    <div className="col-10 mx-auto">
      <h2 className="mb-4">Csatlakozz!</h2>
      <p>A Zsebtanár csapatába junior webfejlesztőt keresünk!</p>
      <p>
        Sajnos pénzt nem tudunk adni, mivel mi is önkéntesként, munka mellett veszünk részt a
        projektben. Viszont ez egy jó lehetőség a fejlődésre, ugyanis a fejlesztést egy tapasztalt
        programozó vezeti, aki nagyon segítőkész. Egyébként pedig az önéletrajzon is jól mutat egy
        ilyen projekt. ;)
      </p>
      <p>
        Ha tudsz programozni, és szeretnél a színfalak mögé kukkantani, nézd meg a github-repónkat:
        <ExternalLink href="https://github.com/zsebtanar/zsebtanar-proto/">https://github.com/zsebtanar/zsebtanar-proto/</ExternalLink> vagy írj egy emailt az info@zsebtanar.hu-ra.
      </p>
      <p>
        Ha nem tudsz programozni, de ismersz valakit, akit érdekelne a dolog (anya, apa, tesó,
        barát, szomszéd néni kiskutyája), nyugodtan küldd el neki ezt a felhívást :)
      </p>
      <p>További szép napot! ;)</p>
      <p>Zsebtanár csapat</p>
      <div className="text-center">
        <img
          className="img-thumbnail"
          style={{ width: 350 }}
          src="/assets/images/Zsebtanar_plakat_mozgas.gif"
          alt="Konvergenst keresünk - fejlessz velünk a játékos matektanulásért"
        />
      </div>
    </div>
  )
})
