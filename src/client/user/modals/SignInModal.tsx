import React from 'react'
import { useDialog } from 'client/overlay/providers'
import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'client/overlay/components/base'
import { Button, Alert, Loading } from 'client/generic/components'
import { useInput } from 'client/generic/hooks'
import { useUserDispatch, useUser } from 'client/user/providers/UserProvider'
import strings from 'client/localisation/strings'

export function SignInModal() {
  const { closeModal } = useDialog()
  const { error, loading, loggedIn } = useUser()
  const { signIn } = useUserDispatch()
  const { value: email, bind: bindEmail } = useInput('')
  const { value: password, bind: bindPassword } = useInput('')

  const close = () => closeModal()

  if (loggedIn) {
    close()
  }

  const submit = () => {
    signIn(email, password)
  }
  const googleSignIn = () => 42
  const facebookSignIn = () => 42

  return (
    <Dialog className="alert">
      <DialogHeader>Bejelentkezés</DialogHeader>
      <form onSubmit={submit} className="mt-5 col-12">
        <DialogBody>
          {
            loading && <Loading/>
          }
          {
            error && <Alert>
              {strings[error.code] || "Nem várt hiba történt a bejelentkezés során'"}
            </Alert>
          }
          <div className="col-10 mx-auto my-5">
            <ul className="list-unstyled">
              <li className="my-1">
                <Button onAction={googleSignIn} className="btn btn-outline-primary btn-block">
                  <i className="fa fa-lg fa-google" /> Google fiókkal
                </Button>
              </li>
              <li className="my-1">
                <Button onAction={facebookSignIn} className="btn btn-outline-primary btn-block">
                  <i className="fa fa-lg fa-facebook" /> Facebook fiókkal
                </Button>
              </li>
            </ul>
          </div>
          <hr />
          <p className="text-center text-muted">vagy használd az email címed</p>
          <div className="form-group">
            <input
              type="email"
              autoFocus
              className="form-control"
              aria-label="E-mail cím"
              placeholder="E-mail"
              autoComplete="email"
              value={email}
              {...bindEmail}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              aria-label="Jelszó"
              placeholder="Jelszó"
              autoComplete="current-password"
              value={password}
              {...bindPassword}
            />
          </div>
          <div>
            <Button btn="link">Elfelejtett jelszó</Button>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button onAction={close} btn="link">
            Mégsem
          </Button>
          <Button submit btn="primary">
            Belépés
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
