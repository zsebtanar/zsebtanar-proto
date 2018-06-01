import * as React from 'react'
import strings from 'client-common/strings'
import { connect } from 'react-redux'
import { facebookSignIn, googleSignIn, signIn } from 'client-common/store/actions/auth'
import { RouteComponentProps } from 'react-router'
import { withRouter } from 'react-router-dom'
import { Button } from 'client-common/component/general/Button'

interface SignInModalProps extends RouteComponentProps<{}>, ui.ModalProps {
  returnPath: string
  message: string
}

interface SignInModalStateProps {
  session: state.Session
}

interface SignInModalDispatchProps {
  signIn: typeof signIn
  googleSignIn: typeof googleSignIn
  facebookSignIn: typeof facebookSignIn
}

const mapStateToProps = state => ({
  session: state.app.session
})

export const SignInModal = withRouter(
  connect<SignInModalStateProps, SignInModalDispatchProps, SignInModalProps>(
    mapStateToProps,
    { signIn, googleSignIn, facebookSignIn }
  )(function(props: SignInModalStateProps & SignInModalDispatchProps & SignInModalProps) {
    let emailField
    let pwField

    const onSubmit = e => {
      e.preventDefault()
      // TODO: remove promise return and use redux store
      props.signIn(emailField.value, pwField.value).then(({ error }) => {
        if (!error) {
          if (props.returnPath && props.returnPath !== props.location.pathname) {
            props.history.push(props.returnPath)
          }
          props.close()
        }
      })
    }

    return (
      <div className={`modal-dialog`} role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Belépés</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Bezárás"
              onClick={props.close}
            >
              <span aria-hidden={true}>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {props.message && (
              <div className="alert alert-info" role="alert">
                {props.message}
              </div>
            )}
            {props.session && props.session.error ? (
              <div className="alert alert-danger" role="alert">
                {strings[props.session.error.code] || 'Nem várt hiba történt a bejelentkezés során'}
              </div>
            ) : (
              ''
            )}
            <div className="col-10 mx-auto my-5">
              <ul className="list-unstyled">
                <li className="my-1">
                  <Button
                    onAction={props.googleSignIn}
                    className="btn btn-outline-primary btn-block"
                  >
                    <i className="fa fa-lg fa-google" /> Google fiókkal
                  </Button>
                </li>
                <li className="my-1">
                  <Button
                    onAction={props.facebookSignIn}
                    className="btn btn-outline-primary btn-block"
                  >
                    <i className="fa fa-lg fa-facebook" /> Facebook fiókkal
                  </Button>
                </li>
              </ul>
            </div>
            <hr />
            <p className="text-center text-muted">vagy használd az email címed</p>
            <form onSubmit={onSubmit} className="my-5 col-12">
              <div className="form-group">
                <input
                  type="email"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="E-mail"
                  ref={inp => {
                    emailField = inp
                  }}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  placeholder="Jelszó"
                  ref={inp => {
                    pwField = inp
                  }}
                />
              </div>
              <div className="text-center">
                <Button submit primary>
                  Mehet
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  })
)
