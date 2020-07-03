import React, { useState } from 'react'
import { useHistory } from 'react-router'
import { useModel } from '../../../generic/hooks/model'
import { useUser } from '../../../user/providers/UserProvider'
import { AuthPageHeader } from '../../nav/AuthPageHeader'
import { FormGroupLabel } from 'client/generic/components/form/FormGroupLabel'
import { PublicPage } from 'client/generic/components/PublicPage'
import { Button } from 'client/generic/components/Button'
import { Alert } from 'client/generic/components/Alert'

interface ForgotPasswordPageData {
  email: string
}

export function ForgottenPasswordPage(): JSX.Element {
  const [state, setState] = useState<string>('init')
  const { bind, data: forgotPasswordData } = useModel<ForgotPasswordPageData>()
  const { loggedIn, forgotPassword } = useUser()
  const history = useHistory()

  const isInit = state === 'init' || state === 'loading'
  const isSent = state === 'sent'

  if (loggedIn) {
    history.replace('/')
  }

  const submit = async (e) => {
    e.preventDefault()
    setState('loading')
    await forgotPassword(forgotPasswordData.email)
    setState('sent')
  }

  return (
    <PublicPage className="page-forgotten-password auth-page">
      <AuthPageHeader />
      <form onSubmit={submit}>
        <h1 className="text-center">Elfelejtett jelszó</h1>
        <hr />

        {isInit && (
          <>
            <FormGroupLabel
              label="Email cím"
              type="email"
              disabled={state === 'loading'}
              className="form-control"
              required={true}
              autoFocus={true}
              {...bind('email')}
            />

            <p>
              Add meg melyik email címmel regisztráltál. A megadott email címre küldünk egy linket,
              ahol lehetőséged van a jelszavad visszaállítására.
            </p>

            <Button
              btn="primary"
              className="text-center w-100 mb-3"
              submit
              disabled={state === 'loading'}
            >
              Elküldöm
            </Button>
          </>
        )}
        {isSent && (
          <>
            <Alert type="info">
              A linket elküldtük a megadott címre. Kérlek ellenőrizd az emailjeidet.
            </Alert>
            <a className="btn btn-link text-center w-100 mt-3" href="/login">
              Bejelentkezés
            </a>
          </>
        )}
      </form>
    </PublicPage>
  )
}
