import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { ExternalLink } from 'client/generic/components'

export function Footer() {
  return (
    <footer className="footer">
      <p>
        &copy; Zsebtanár Nonprofit Alapítvány {new Date().getFullYear()}
        {' - '}
        <NavLink to="/about">Rólunk</NavLink>
        {' - '}
        <NavLink to="/joinus">Csatlakozz!</NavLink>
        {' - '}
        <ExternalLink href={__CONFIG__.links.policy}>Adatvédelem</ExternalLink>
        {' - '}
        {/*FIXME: feedback modal*/}
        <div>Visszajelzés</div>
        {' - '}
        <NavLink to="/support">Hibaelhárítás</NavLink>
        {' - '}
        <ExternalLink href="https://www.facebook.com/zsebtanar">Facebook</ExternalLink>
        {' - '}
        <ExternalLink href="http://v1.zsebtanar.hu/" title="Zsebtanár 1.0">
          Régi oldal
        </ExternalLink>
      </p>
    </footer>
  )
}
