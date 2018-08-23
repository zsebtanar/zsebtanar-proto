import * as React from 'react'
import { withTracker } from '../component/hoc/withTracker'

export const About = withTracker(function AboutPage() {
  return (
    <div className="col-10 mx-auto">
      <h2 className="mb-4">Rólunk</h2>
      <hr />
      <h3>Mi a Zsebtanár?</h3>
      <p>
        A Zsebtanár egy interaktív feladatgyűjtemény, amely ingyenes és hatékony segítséget nyújt a tanulásban.
      </p>

      <h3 className="mt-4">Kiknek készült?</h3>
      <p>Elsősorban érettségizőknek, de általános és középiskolások is haszonnal forgathatják.</p>

      <h3 className="mt-4">Kik állnak mögötte?</h3>
      <p>
        Egy lelkes kis csapat vagyunk. Ami közös bennünk, hogy mindannyian szeretnénk, hogy a
        tanulás ne nyűg, hanem játék legyen. :)
      </p>

      <h3 className="mt-4">Hogyan segíthetsz?</h3>
      <p>
        Leginkább úgy, ha használod a honlapot, és megosztod velünk a véleményed. Ha pedig szeretnél
        anyagilag is hozzájárulni a projekthez, itt támogathatsz bennünket:
      </p>

      <div className="pl-4">
        <dl className="row">
          <dt className="col-sm-3">Név:</dt>
          <dd className="col-sm-9">Zsebtanár Nonprofit Alapítvány</dd>

          <dt className="col-sm-3">Számlaszám:</dt>
          <dd className="col-sm-9">
            <code>11711058-21451944</code>
          </dd>

          <dt className="col-sm-3">Megjegyzés:</dt>
          <dd className="col-sm-9">Támogatás</dd>
        </dl>
      </div>
    </div>
  )
})
