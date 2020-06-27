import * as React from 'react'
import {
  PublicPage,
  FormGroupLabel,
  Button,
  GoogleIcon,
  FacebookIcon,
  HrWithLabel,
} from 'client/generic/components'
import { useModel } from '../../generic/hooks/model'

import './RegisterPage.scss'

export function RegisterPage() {
  const { bind } = useModel()
  return (
    <PublicPage className="page-register">
      <form action="">
        <h1 className="text-center">Regisztráció</h1>
        <hr />
        <FormGroupLabel
          label="Email cím"
          type="email"
          className="form-control"
          required={true}
          autoFocus={true}
          {...bind('email')}
        />

        <FormGroupLabel
          label="Felhasználói név"
          type="text"
          className="form-control"
          required={true}
          {...bind('name')}
        />

        <FormGroupLabel
          label="Jelszó"
          type="password"
          className="form-control"
          required={true}
          {...bind('password')}
        />

        <Button btn="primary" className="text-center w-100" submit>
          Regisztrálok
        </Button>

        <HrWithLabel label="VAGY" />
        <div className="row">
          <div className="col-6">
            <Button btn="outline-primary" className="w-100 text-center">
              <FacebookIcon /> Facebook
            </Button>
          </div>
          <div className="col-6">
            <Button btn="outline-primary" className="w-100 text-center">
              <GoogleIcon /> Google
            </Button>
          </div>
        </div>
      </form>
    </PublicPage>
  )
}
