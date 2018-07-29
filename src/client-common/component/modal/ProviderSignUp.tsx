import * as React from 'react'
import { keys } from 'ramda'
import { Button } from '../general/Button'

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export class ProviderSignUp extends React.Component<any, any> {
  state = {
    errors: {}
  }

  private emailField
  private nameField
  private pwField

  saveDetails = event => {
    event.preventDefault()
    if (this.validate()) {
      this.props.onSave(
        {
          email: this.emailField.value,
          displayName: this.nameField.value
        },
        {
          email: this.emailField.value,
          password: this.props.requestPassword ? this.pwField.value : ''
        }
      )
      this.props.close()
    }
  }

  validate() {
    const errors: any = {}
    const email = (this.emailField.value || '').trim()
    const name = (this.nameField.value || '').trim()
    const passwordReq = this.props.requestPassword

    if (!email) errors.email = 'Kérlek, add meg az e-mail címed!'
    else if (!EMAIL_REGEX.test(email)) errors.email = 'Érvénytelen e-mail cím!'

    if (!name) errors.name = 'Kérlek, add meg a felhasználóneved!'
    else if (name.length < 3)
      errors.name = 'A felhasználónévnek legalább 3 karakter hosszúnak kell lennie!'

    if (passwordReq) {
      const pw1 = this.pwField.value

      if (!pw1) errors.password = 'Kérlek, adj meg egy jelszót!'
      else if (pw1.length < 6)
        errors.password = 'A jelszónak legalább 6 karakter hosszúnak kell lennie!'
    }
    this.setState({ errors })
    return keys(errors).length === 0
  }

  render() {
    const { close, data, requestPassword } = this.props
    const err: any = this.state.errors

    return (
      <div className="modal-dialog" role="document">
        <form onSubmit={this.saveDetails} noValidate>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Regisztrációs adatok</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Bezárás">
                <span aria-hidden={true} onClick={close}>
                  &times;
                </span>
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <input
                  type="email"
                  autoFocus={!data.email}
                  id="id-sign-up-email"
                  className={`form-control ${err.email ? 'is-invalid' : ''}`}
                  placeholder="E-mail"
                  value={data.email}
                  required
                  readOnly={!!data.email}
                  ref={inp => {
                    this.emailField = inp
                  }}
                />
                {this.renderFeedback('email')}
              </div>
              <div className="form-group">
                <input
                  type="text"
                  autoFocus={!!data.email}
                  id="id-sign-up-name"
                  className={`form-control ${err.name ? 'is-invalid' : ''}`}
                  placeholder="Felhasználói név"
                  value={data.displayName}
                  ref={inp => {
                    this.nameField = inp
                  }}
                />
                {this.renderFeedback('name')}
              </div>
              {requestPassword ? (
                <div>
                  <div className="form-group">
                    <input
                      type="password"
                      className={`form-control ${err.password ? 'is-invalid' : ''}`}
                      id="id-pw-1"
                      placeholder="Jelszó"
                      ref={inp => {
                        this.pwField = inp
                      }}
                    />
                    {this.renderFeedback('password')}
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>

            <div className="modal-footer text-center">
              <Button submit primary onAction={this.saveDetails}>
                Kész
              </Button>
            </div>
          </div>
        </form>
      </div>
    )
  }

  renderFeedback(name) {
    const err = this.state.errors[name]
    if (err) {
      return <div className="invalid-feedback">{err}</div>
    }
  }
}
