import React from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import debounce from 'client/generic/utils/debounce'
import { useUser } from '../../user/providers/UserProvider'
import { MainClassificationSelector } from '../components/MainClassificationSelector'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PatreonButton } from '../components/PatreonButton'
import { PaypalButton } from '../components/PaypalButton'

export function Home(): JSX.Element {
  const history = useHistory()

  const searchInputChange = debounce((e) => {
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
                <FontAwesomeIcon icon={faSearch} size="lg" />
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
