import React from 'react'
import { useUser } from '../../user/providers/UserProvider'
import { ClassificationSelector } from '../../classification/components/ClassificationSelector'
import { PatreonButton } from '../components/PatreonButton'
import { PaypalButton } from '../components/PaypalButton'
import { YouTubeEmbed } from '../components/YoutubeEmbed'

import './Home.scss'

export function Home(): JSX.Element {
  return (
    <div>
      <div className="jumbotron">
        <HomeWelcome />
      </div>

      <div className="home-youtube d-flex justify-content-center">
        <YouTubeEmbed />
      </div>

      <ClassificationSelector title="Osztály" rootCategory="hu|grade|" />

      <div className="text-center pt-5 my-5">
        <p>
          <i>Tetszik az oldal? Támogasd munkánkat, hogy még jobb legyen!</i>
        </p>
        <div className="row">
          <div className="col-md-8 mx-auto row">
            <div className="col-md-6 mb-1">
              <PaypalButton />
            </div>
            <div className="col-md-6">
              <PatreonButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function HomeWelcome() {
  const session = useUser()

  if (session.loggedIn) {
    return <h1 className="text-center">Szia {session?.user?.displayName ?? session.user?.email}</h1>
  } else {
    return (
      <div className="text-center">
        <h1>
          <strong>Zsebtanár</strong>
        </h1>
        <h4>Tanulás lépésről lépésre</h4>
      </div>
    )
  }
}
