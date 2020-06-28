import * as React from 'react'
import { useHistory } from 'react-router'
import {
  PublicPage,
  FormGroupLabel,
  Button,
  GoogleIcon,
  FacebookIcon,
  HrWithLabel,
  Alert,
  Link,
} from 'client/generic/components'
import { useModel } from '../../../generic/hooks/model'
import { useUser } from '../../../user/providers/UserProvider'
import { ProviderTypes } from '../../../user/types'
import { errorToString } from '../../../generic/utils'
import strings from '../../../localisation/strings'
import { AuthPageHeader } from '../../nav/AuthPageHeader'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface LoginData {
  email: string
  password: string
}

export function LoginPage() {
  const { bind, data: registrationData } = useModel<LoginData>()
  const { isLoading, loggedIn, signIn, ssoSignIn, hasError, error } = useUser()
  const history = useHistory()

  if (loggedIn) {
    history.replace('/')
  }

  const login = e => {
    e.preventDefault()
    const { email, password } = registrationData
    signIn(email, password)
  }

  const signInWithGoogle = () => ssoSignIn(ProviderTypes.Google)
  const signInWithFacebook = () => ssoSignIn(ProviderTypes.Facebook)

  return (
    <PublicPage className="page-login auth-page">
      <AuthPageHeader>
        <Link href="/register" className="btn btn-outline-primary">
          <FontAwesomeIcon icon={faPlus} /> Regisztráció
        </Link>
      </AuthPageHeader>

      <form onSubmit={login}>
        <h1 className="text-center">Bejelenetkezés</h1>
        <hr />
        {hasError && <Alert type="danger">{errorToString(error, strings)}</Alert>}
        <FormGroupLabel
          label="Email cím"
          type="email"
          disabled={isLoading}
          className="form-control"
          required={true}
          autoFocus={true}
          {...bind('email')}
        />

        <FormGroupLabel
          label="Jelszó"
          type="password"
          disabled={isLoading}
          className="form-control"
          required={true}
          {...bind('password')}
        />

        <Button btn="primary" className="text-center w-100 mb-3" submit loading={isLoading}>
          Belépés
        </Button>

        <a className="btn btn-link text-center w-100" href="/forgotten-password">
          Elfelejtetted a jelszavad?
        </a>

        <HrWithLabel label="VAGY" />
        <div className="row">
          <div className="col-sm-6 mb-3">
            <Button
              btn="outline-primary"
              className="w-100 text-center"
              onAction={signInWithFacebook}
            >
              <FacebookIcon /> Facebook
            </Button>
          </div>
          <div className="col-sm-6 mb-3">
            <Button btn="outline-primary" className="w-100 text-center" onAction={signInWithGoogle}>
              <GoogleIcon /> Google
            </Button>
          </div>
        </div>
      </form>
    </PublicPage>
  )
}
