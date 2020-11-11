import * as React from 'react'
import { useHistory } from 'react-router'
import { useModel } from '../../../generic/hooks/model'
import { useUser } from '../../../user/providers/UserProvider'
import { ProviderTypes } from '../../../user/types'
import strings from '../../../localisation/strings'
import { AuthPageHeader } from '../../nav/AuthPageHeader'
import { User as UserIcon } from 'react-feather'
import { PublicPage } from 'client/generic/components/PublicPage'
import { Link } from 'client/generic/components/Link'
import { Alert } from 'client/generic/components/Alert'
import { errorToString } from '../../../generic/utils/error'
import { FormGroupLabel } from 'client/generic/components/form/FormGroupLabel'
import { Button } from 'client/generic/components/Button'
import { HrWithLabel } from 'client/generic/components/HrWithLabel'
import { FacebookIcon } from 'client/generic/components/icons/FacebookIcon'
import { GoogleIcon } from 'client/generic/components/icons/GoogleIcon'
import { Icon } from 'client/generic/components/icons/Icon'

interface RegistrationData {
  email: string
  name: string
  password: string
}

export function RegisterPage(): JSX.Element {
  const { bind, data: registrationData } = useModel<RegistrationData>()
  const { isRegistration, loggedIn, signUp, ssoSignIn, hasError, error } = useUser()
  const history = useHistory()

  if (loggedIn) {
    history.replace('/')
  }

  const register = (e) => {
    e.preventDefault()
    const { email, password, name } = registrationData
    signUp(email, password, name)
  }

  const signInWithGoogle = () => ssoSignIn(ProviderTypes.Google)
  const signInWithFacebook = () => ssoSignIn(ProviderTypes.Facebook)

  return (
    <PublicPage className="page-register auth-page">
      <AuthPageHeader>
        <Link to="/login" className="btn btn-outline-primary">
          <Icon icon={UserIcon} /> Belépés
        </Link>
      </AuthPageHeader>

      <form onSubmit={register}>
        <h1 className="text-center">Regisztráció</h1>
        <hr />
        {hasError && <Alert type="danger">{errorToString(error, strings)}</Alert>}
        <FormGroupLabel
          label="Email cím"
          type="email"
          disabled={isRegistration}
          className="form-control"
          required={true}
          autoFocus={true}
          {...bind('email')}
        />

        <FormGroupLabel
          label="Felhasználói név"
          type="text"
          disabled={isRegistration}
          className="form-control"
          required={true}
          {...bind('name')}
        />

        <FormGroupLabel
          label="Jelszó"
          type="password"
          disabled={isRegistration}
          className="form-control"
          required={true}
          {...bind('password')}
        />

        <Button btn="primary" className="text-center w-100" submit loading={isRegistration}>
          Regisztrálok
        </Button>

        <HrWithLabel label="VAGY" />
        <div className="row">
          <div className="col-sm-6 mb-3">
            <Button
              btn="outline-primary"
              disabled={isRegistration}
              className="w-100 text-center"
              onAction={signInWithFacebook}
            >
              <Icon icon={FacebookIcon} /> Facebook
            </Button>
          </div>
          <div className="col-sm-6 mb-3">
            <Button
              btn="outline-primary"
              disabled={isRegistration}
              className="w-100 text-center"
              onAction={signInWithGoogle}
            >
              <Icon icon={GoogleIcon} /> Google
            </Button>
          </div>
        </div>
      </form>
    </PublicPage>
  )
}
