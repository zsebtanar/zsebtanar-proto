import * as React from 'react'
import { withTracker } from '../component/hoc/withTracker'
import { PaypalButton } from '../../client-public/component/PaypalButton'
import { PatreonButton } from '../../client-public/component/PatreonButton'

export const About = withTracker(function AboutPage() {
  return (
    <div className="mx-auto">
      <div className="container">
        <h2 className="mb-4">A honlapról</h2>
        <hr />
        <div className="row mb-5">
          <div className="col-md">
            <h4 className="mt-4">Mi a Zsebtanár?</h4>
            <p>
              A Zsebtanár egy interaktív feladatgyűjtemény, amely ingyenes és hatékony segítséget nyújt a tanulásban.
            </p>
          </div>
          <div className="col-md">
            <h4 className="mt-4">Kiknek készült?</h4>
            <p>Elsősorban érettségizőknek, de általános és középiskolások is haszonnal forgathatják.</p>
          </div>
          <div className="col-md mb-10">
            <h4 className="mt-4">Kik állnak mögötte?</h4>
            <p>
              A honlapot a Zsebtanár Nonprofit Alapítvány fejleszti önkéntesek segítségével.
            </p>
          </div>
        </div>
        <h2 className="mb-4 mt-5">A csapatról</h2>
        <hr />
        <div className="row">
          <div className="col-md">
            <img
              width="90%"
              src="/assets/images/zst_gergo.png"
              alt="Gergő"
            />
            <h4 className="mt-4">Az Elnök</h4>
            <p>
              Gergő vagyok, dizájner. A Zsebtanár Alapítvány elnökeként elsősorban a hivatalos teendőket intézem. Emellett szívesen besegítek a dizájnban és a UX-fejlesztésben is.
            </p>
          </div>
          <div className="col-md">
            <img
              width="90%"
              src="/assets/images/zst_laci.png"
              alt="Laci"
            />
            <h4 className="mt-4">A Kódmester</h4>
            <p>
              Laci vagyok, jelenleg Angliában dolgozom programozóként. Szabadidőmben a honlap fejlesztésével foglalkozom. Ha ismersz valakit, aki szívesen csatlakozna, csak szólj! ;)
            </p>
          </div>
          <div className="col-md">
            <img
              width="90%"
              src="/assets/images/zst_viktor.png"
              alt="Viktor"
            />
            <h4 className="mt-4">Az Ötletgazda</h4>
            <p>
              Viktor vagyok, matematikusként végeztem. Régi álmom egy olyan honlap, ami segít abban, hogy a tanulás ne nyűg, hanem játék legyen. Remélem, Te is hasznosnak találod majd. :)
            </p>
          </div>
        </div>
        <p>...és még sokan mások, akik különböző módon járultak hozzá ennek a projektnek a megvalósulásához. Ezúton is köszönjük a segítségüket!</p>
        <h2 className="mb-4 mt-5">Támogatás</h2>
        <hr />
        <p>
          Ez a honlap teljes mértékben önkéntesek munkája. Ha szeretnél anyagilag támogatni bennünket, megteheted banki átutalással:
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
        <div className="mt-4">
          <p>...vagy online:</p>
        </div>
        <div className="row">
          <div className="col-md-2"></div>
          <div className="col-md-4">
            <PaypalButton />
          </div>
          <div className="col-md-4">
            <PatreonButton />
          </div>
          <div className="col-md-2"></div>
        </div>
      </div>
    </div>
  )
})
