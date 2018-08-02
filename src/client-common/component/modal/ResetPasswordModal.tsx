import * as React from 'react'
import strings from 'client-common/strings'
import { Button } from '../general/Button'
import { Dialog } from './base/Dialog'
import { DialogBody } from './base/DialogBody'
import { DialogHeader } from './base/DialogHeader'
import { forgotPassword } from '../../store/actions/auth'

enum States {
  Base,
  Success,
  Error
}

interface ResetPasswordModalProps extends ui.ModalProps {
  email?: string
}

interface ResetPasswordModalStates {
  state: States
  error?: any
}

export class ResetPasswordModal extends React.Component<
  ResetPasswordModalProps,
  ResetPasswordModalStates
> {
  state = {
    state: States.Base,
    error: undefined
  }

  private emailField

  private submitForm = e => {
    e.preventDefault()
    forgotPassword(this.emailField.value)
      .then(() => this.setState({ state: States.Success }))
      .catch(error => this.setState({ state: States.Error, error }))
  }

  private reset = () => this.setState({ state: States.Base, error: undefined })

  private emailRef = ref => (this.emailField = ref)

  render() {
    return (
      <Dialog className="forgot-password">
        <DialogHeader onClose={this.props.close}>Új jelszó kérés</DialogHeader>
        <DialogBody>{this.renderContent()}</DialogBody>
      </Dialog>
    )
  }

  private renderContent() {
    switch (this.state.state) {
      case States.Base:
        return this.renderBase()
      case States.Success:
        return this.renderSuccess()
      case States.Error:
        return this.renderError(this.state.error || {})
    }
    return <div />
  }

  private renderBase() {
    return (
      <form onSubmit={this.submitForm}>
        <p className="text-muted text-center">
          Add meg az e-mail címed és mi elküldjük rá az új jelszóhoz szükséges linket.
        </p>
        <div className="form-group my-4 mx-auto col-10">
          <input
            required
            autoFocus
            type="email"
            className="form-control"
            id="forgotPWInputEmail"
            aria-describedby="emailHelp"
            placeholder="E-mail"
            defaultValue={this.props.email || ''}
            ref={this.emailRef}
          />
        </div>
        <div className="text-center">
          <Button className="btn-primary" submit>
            Küldés
          </Button>
        </div>
      </form>
    )
  }

  private renderSuccess() {
    return (
      <div>
        <div className="alert alert-success my-4">
          Hamarosan kapsz egy emailt, mely tartalmazza a linket az új jelszó létrehozásához.
        </div>
        <div className="text-center">
          <Button className="btn-secondary" onAction={this.props.close}>
            Bezárás
          </Button>
        </div>
      </div>
    )
  }
  private renderError(error) {
    return (
      <div>
        <div className="alert alert-danger my-4">
          {error.code ? strings[error.code] : 'Ismeretlen hiba történt'}
        </div>
        <div className="text-center">
          <Button className="btn-secondary" onAction={this.reset}>
            Vissza
          </Button>
        </div>
      </div>
    )
  }
}

// default export for dynamic import
export default ResetPasswordModal
