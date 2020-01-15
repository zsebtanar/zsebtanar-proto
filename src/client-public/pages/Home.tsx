import React from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import debounce from 'client-common/utils/debounce'
import { Icon } from 'client-common/components/generic'
import { useUser } from 'client-common/providers'

import { MainClassificationSelector } from '../components/MainClassificationSelector'
import { PaypalButton, PatreonButton } from '../components'

export function Home() {
  const history = useHistory()

  const searchInputChange = debounce(e => {
    history.push({ pathname: '/search', search: `?q=${e.currentTarget.value}` })
  }, 800)

  return (
    <div>
      <div className="jumbotron">
        <HomeWelcome />
        <div className="my-5 col-11 mx-auto">
          <NavLink to="/search">
            <div className="search-input-group ">
              <label className="search-label" htmlFor="search-input">
                <Icon fa="search" size="lg" />
                <span className="sr-only">Feladat keresés</span>
              </label>
              <input
                id="search-input"
                type="text"
                className="form-control"
                placeholder="Feladat keresés ..."
                autoFocus
                onChange={searchInputChange}
              />
            </div>
          </NavLink>
        </div>
      </div>

      <MainClassificationSelector />

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
