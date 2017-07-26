import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { facebookSignIn, googleSignIn, signUp } from 'store/actions/auth'
import Button from 'shared/component/general/Button'
import { openProviderSignUp } from 'store/actions/modal'

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
  const emailSingUp = () => {
    props.openProviderSignUp({
      data: {},
      requestPassword: true,
      onSave: (data, {email, password}) => {
        props.signUp(email, password, data)
      }
    })
  }

  return (<div className="col-md-6 offset-md-3 my-5">
    <h1 className="text-center">Regisztráció</h1>
    {
      props.session && props.session.error
        ? <div className="alert alert-danger" role="alert">{props.session.error.message}</div>
        : ''
    }
    <div>
      <div className="offset-1 col-10 my-5">
        <ul className="list-unstyled">
          <li className="my-1">
            <Button onAction={props.googleSignIn} className="btn btn-secondary btn-block">
              <i className="fa fa-lg fa-google"/> Google bejelentkezés
            </Button>
          </li>
          <li className="my-1">
            <Button onAction={props.facebookSignIn} className="btn btn-secondary btn-block">
              <i className="fa fa-lg fa-facebook"/> Facebook bejelentkezés
            </Button>
          </li>
          <li className="my-1">
            <Button onAction={emailSingUp} className="btn btn-secondary btn-block">
              <i className="fa fa-lg fa-envelope"/> E-mail bejelentkezés
            </Button>
          </li>
        </ul>
      </div>
    </div>
  </div>)
}))
