import * as React from 'react'
import { CustomError, NotFoundError } from '../../utils/error'
import history from 'client-common/history'
import { Icon } from './Icon'

interface ShowErrorProps {
  showMenu?: boolean
  error?: CustomError
}

export function ShowError({ error, showMenu }: ShowErrorProps) {
  return (
    <div className="d-flex h-100">
      <div className="m-auto d-flex align-items-center flex-column">
        {<ErrorMessage error={error} />}
        {showMenu && <ErrorMenu />}
      </div>
    </div>
  )
}

function ErrorMessage({ error }) {
  if (!error || error instanceof NotFoundError) {
    return (
      <>
        <Icon size="4x" fa="wpexplorer" />
        <h1 className="my-5 text-center">A keresett oldal nem található.</h1>
      </>
    )
  } else {
    return (
      <>
        <Icon size="4x" fa="exclamation-triangle" className="text-danger" />
        <h1 className="text-center">
          Ooopsz... <br /> Nem várt hiba történt :(
        </h1>
        <p className="my-5 alert alert-danger">
          <strong>Hiba oka:</strong>
          <br /> {(error && error.message) || 'Ismeretlen'}
        </p>
      </>
    )
  }
}

function ErrorMenu() {
  return (
    <nav className="mt-5">
      <ul className="nav flex-column">
        <li className="nav-item">
          <a
            className="nav-link"
            href="/"
            ref={el => el && el.focus()}
            onClick={() => history.back()}
          >
            Vissza az előző oldalra
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/">
            Főoldal
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/search">
            Keresés
          </a>
        </li>
      </ul>
    </nav>
  )
}
