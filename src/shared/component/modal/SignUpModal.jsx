import * as React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { facebookSignIn, googleSignIn, signUp } from 'shared/store/actions/auth'
import Button from 'shared/component/general/Button'
import { openProviderSignUp } from 'shared/store/actions/modal'
import strings from 'shared/strings'
import Loading from '../general/Loading'

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
  })(
    class extends React.Component {
      success = data => {
        if (!data || !data.error) {
          this.props.close()
          this.props.history.push('/')
        }
      }

      emailSingUp = () => {
        this.props.openProviderSignUp({
          data: {},
          requestPassword: true,
          onSave: (data, { email, password }) => {
            this.props.signUp(email, password, data).then(this.success)
          }
        })
      }

      googleSignUp = () => {
        this.props.googleSignIn().then(this.success)
      }

      facebookSignUp = () => {
        this.props.facebookSignIn().then(this.success)
      }

      render() {
        const { close } = this.props

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
                  onClick={close}
                >
                  <span aria-hidden={true}>&times;</span>
                </button>
              </div>
              <div className="modal-body">{this.renderContent()}</div>
            </div>
          </div>
        )
      }

      renderContent() {
        const { session } = this.props

        if (session && session.error) {
          return this.renderError()
        } else {
          if (session && session.emailSignUpLoading) {
            return <Loading />
          } else {
            return this.renderOptions()
          }
        }
      }

      renderError() {
        const { session } = this.props
        return (
          <div className="alert alert-danger" role="alert">
            {strings[session.error.code] || 'Nem várt hiba történt a regisztráció során'}
          </div>
        )
      }

      renderOptions() {
        return (
          <div>
            <div className="col-12 my-5">
              <ul className="list-unstyled">
                <li className="my-1">
                  <Button
                    onAction={this.googleSignUp}
                    className="btn btn-outline-primary btn-block"
                  >
                    <i className="fa fa-lg fa-google" /> Google fiókkal
                  </Button>
                </li>
                <li className="my-1">
                  <Button
                    onAction={this.facebookSignUp}
                    className="btn btn-outline-primary btn-block"
                  >
                    <i className="fa fa-lg fa-facebook" /> Facebook fiókkal
                  </Button>
                </li>
                <li className="my-1">
                  <Button onAction={this.emailSingUp} className="btn btn-outline-primary btn-block">
                    <i className="fa fa-lg fa-envelope" /> E-mail címmel
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        )
      }
    }
  )
)
