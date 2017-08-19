import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { facebookSignIn, googleSignIn, signUp } from 'shared/store/actions/auth'
import Button from 'shared/component/general/Button'
import { openProviderSignUp } from 'shared/store/actions/modal'
import strings from 'shared/strings'

const mapStateToProps = (state) => ({
  auth: state.auth,
  session: state.app.session
})

export default withRouter(connect(mapStateToProps, {
  signUp,
  googleSignIn,
  facebookSignIn,
  openProviderSignUp
})(function (props) {
  const success = ({error}) => error ? null : props.history.push('/')

  const emailSingUp = () => {
    props.openProviderSignUp({
      data: {},
      requestPassword: true,
      onSave: (data, {email, password}) => {
        props
          .signUp(email, password, data)
          .then(success)
      }
    })
  }

  const googleSignUp = () => {
    props
      .googleSignIn()
      .then(success)
  }

  const facebookSignUp = () => {
    props
      .facebookSignIn()
      .then(success)
  }

  return (<div className="col-md-6 mx-auto my-5">
    <h1 className="text-center">Regisztráció</h1>
    {
      props.session && props.session.error
        ? <div className="alert alert-danger" role="alert">{strings[props.session.error.code] || 'Nem várt hiba történt a regisztráció során'}</div>
        : ''
    }
    <div>
      <div className="col-12 my-5">
        <ul className="list-unstyled">
          <li className="my-1">
            <Button onAction={googleSignUp} className="btn btn-outline-primary btn-block">
              <i className="fa fa-lg fa-google"/> Google fiókkal
            </Button>
          </li>
          <li className="my-1">
            <Button onAction={facebookSignUp} className="btn btn-outline-primary btn-block">
              <i className="fa fa-lg fa-facebook"/> Facebook fiókkal
            </Button>
          </li>
          <li className="my-1">
            <Button onAction={emailSingUp} className="btn btn-outline-primary btn-block">
              <i className="fa fa-lg fa-envelope"/> E-mail címmel
            </Button>
          </li>
        </ul>
      </div>
    </div>
  </div>)
}))
