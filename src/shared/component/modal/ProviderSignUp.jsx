import React from 'react'
import Button from '../general/Button'

export default (class ProviderSignUp extends React.Component {
  saveDetails = event => {
    event.preventDefault()
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

  render() {
    const props = this.props
    return (
      <div className="modal-dialog" role="document">
        <form onSubmit={this.saveDetails}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Regisztrációs adatok</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Bezárás">
                <span aria-hidden={true} onClick={props.close}>
                  &times;
                </span>
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <input
                  type="email"
                  autoFocus={!this.props.data.email}
                  id="id-sign-up-name"
                  className="form-control"
                  placeholder="Email"
                  value={this.props.data.email}
                  required
                  readOnly={!!this.props.data.email}
                  ref={inp => {
                    this.emailField = inp
                  }}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  autoFocus={!!this.props.data.email}
                  id="id-sign-up-name"
                  className="form-control"
                  placeholder="Felhasználói név"
                  value={this.props.data.displayName}
                  ref={inp => {
                    this.nameField = inp
                  }}
                />
              </div>
              {this.props.requestPassword ? (
                <div>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control"
                      id="id-pw-1"
                      placeholder="Jelszó"
                      ref={inp => {
                        this.pwField = inp
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control"
                      id="id-pw-2"
                      placeholder="Jelszó mégegyszer"
                      ref={inp => {
                        this.pwField2 = inp
                      }}
                    />
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
})
