import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { facebookSignIn, googleSignIn, signUp } from 'shared/store/actions/auth'
import Button from 'shared/component/general/Button'
import { openProviderSignUp } from 'shared/store/actions/modal'
import strings from 'shared/strings'

const mapStateToProps = state => ({
  auth: state.auth,
  session: state.app.session
})

export default withRouter(
  connect(mapStateToProps, {
    signUp,
    googleSignIn,
    facebookSignIn,
    openProviderSignUp
  })(function(props) {
    const success = data => {
      if (!data || !data.error) {
        props.close()
        props.history.push('/')
      }
    }

    const emailSingUp = () => {
      props.openProviderSignUp({
        data: {},
        requestPassword: true,
        onSave: (data, { email, password }) => {
          props.signUp(email, password, data).then(success)
        }
      })
    }

    const googleSignUp = () => {
      props.googleSignIn().then(success)
    }

    const facebookSignUp = () => {
      props.facebookSignIn().then(success)
    }

    return (
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Regisztráció</h5>
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
            {props.session && props.session.error ? (
              <div className="alert alert-danger" role="alert">
                {strings[props.session.error.code] || 'Nem várt hiba történt a regisztráció során'}
              </div>
            ) : (
              ''
            )}
            <div>
              <div className="col-12 my-5">
                <ul className="list-unstyled">
                  <li className="my-1">
                    <Button onAction={googleSignUp} className="btn btn-outline-primary btn-block">
                      <i className="fa fa-lg fa-google" /> Google fiókkal
                    </Button>
                  </li>
                  <li className="my-1">
                    <Button onAction={facebookSignUp} className="btn btn-outline-primary btn-block">
                      <i className="fa fa-lg fa-facebook" /> Facebook fiókkal
                    </Button>
                  </li>
                  <li className="my-1">
                    <Button onAction={emailSingUp} className="btn btn-outline-primary btn-block">
                      <i className="fa fa-lg fa-envelope" /> E-mail címmel
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  })
)
