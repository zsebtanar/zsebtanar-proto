import * as React from 'react'
import { Link } from '../component/general/Link'
import { connect } from 'react-redux'
import { openFeedbackModal } from '../store/actions/modal'
import { pipe } from 'ramda'
import { ExternalLink } from '../component/general/ExternalLink'
import { setupPage } from '../component/hoc/setupPage'

interface DispatchProps {
  openFeedbackModal: typeof openFeedbackModal
}

export const Workarounds = pipe(
  setupPage(),
  connect<void, DispatchProps, void>(
    undefined,
    { openFeedbackModal }
  )
)(
  class WorkaroundsPage extends React.PureComponent<DispatchProps> {
    render() {
      return (
        <div className="col-10 mx-auto">
          <h2 className="mb-4">Hibaelhárítás</h2>

          <p>
            Kérlek nézd át az alábbi leírásokat. Ha nem sikerült megtalálni megoldást, akkor kérünk
            segítsd az oldal fejlesztését és írd meg nekünk a problémát:
          </p>
          <ul className="my-2">
            <li>
              Írj <Link onAction={this.props.openFeedbackModal}>Visszajelzés</Link> vagy
            </li>
            <li>
              Hozz létre egy hibajegyet a{' '}
              <ExternalLink href="https://github.com/zsebtanar/zsebtanar-proto/issues">
                fejlesztői oldalon
              </ExternalLink>
            </li>
          </ul>

          <hr className="m-5" />

          <section>
            <h3 className="mb-4">1) Facebook bejelentkezés nem működik Firefox böngészőben</h3>
            <div className="pl-5">
              <p>
                A Firefox böngésző (v61 és régebbi) alapértelmezetten tartalmaz egy úgy nevezett
                „Container” kiegészítőt ami elszeparálja a különböző oldalakat egymástól.
                Alapértelmezetten a böngésző konténerbe teszi a Facebook oldalt így amikor a
                Zsebtanárra próbálsz bejelentkezést akkor ez a funkció blokkolja a belépést.
              </p>

              <p>A belépés javításához töröljük a kiegészítőt</p>
              <ol>
                <li>
                  nyisd meg a következő oldalt Firefox-ban{' '}
                  <ExternalLink href="https://testpilot.firefox.com/experiments/containers">
                    {'https://testpilot.firefox.com/experiments/containers'}
                  </ExternalLink>
                </li>
                <li>
                  Kattints az alábbi gombra:
                  <br />
                  <img
                    className="img-thumbnail"
                    src="/assets/images/hibaelharitas-ff-01.png"
                    alt="Container kikapcsolás"
                  />
                </li>
                <li>
                  Majd erősítsük meg:
                  <br />
                  <img
                    className="img-thumbnail"
                    src="/assets/images/hibaelharitas-ff-02.png"
                    alt="Container kikapcsolás megerősítés"
                    style={{ height: 250 }}
                  />
                </li>
              </ol>
              <p>Ezt követően már működni fog a Facebook-os bejelentkezés.</p>
              <p>
                A biztonságos böngészés érdekében érdemes feltelepíteni a Container kiegészítő újabb
                verzióját ami az alábbi linkről érhető el:{' '}
                <ExternalLink href="https://addons.mozilla.org/en-US/firefox/addon/multi-account-containers/">
                  {'https://addons.mozilla.org/en-US/firefox/addon/multi-account-containers/'}
                </ExternalLink>
              </p>
              <p>
                Fontos, hogy ha a Facebook oldalt külön konténerben nyitjuk meg akkor célszer a
                Zsebtanár oldalhoz is ugyanazt használni.
              </p>
            </div>
          </section>
        </div>
      )
    }
  }
)
