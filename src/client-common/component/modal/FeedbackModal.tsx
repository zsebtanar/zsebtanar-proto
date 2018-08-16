import * as React from 'react'
import { connect } from 'react-redux'
import ReCAPTCHA from 'react-google-recaptcha'
import { pathOr, prop, propEq } from 'ramda'
import { createFeedback } from 'client-common/services/feedback'
import { Loading } from 'client-common/component/general/Loading'
import { Button } from 'client-common/component/general/Button'
import { DialogHeader } from './base/DialogHeader'
import { DialogBody } from './base/DialogBody'
import { DialogFooter } from './base/DialogFooter'
import { Dialog } from './base/Dialog'

interface FeedbackModalProps {
  session: state.Session
}

interface FeedbackModalState {
  state: 'init' | 'loading' | 'finished' | 'error'
  capthca?: string
}

const mapStateToProps = state => ({
  session: state.app.session
})

export const FeedbackModal = connect<{}, FeedbackModalProps, ui.ModalProps>(mapStateToProps)(
  class FeedbackModal extends React.Component<
    FeedbackModalProps & ui.ModalProps,
    FeedbackModalState
  > {
    state = {
      state: 'init',
      capthca: undefined
    } as FeedbackModalState

    private feedbackErrorField
    private feedbackNoteField
    private descriptionField
    private emailField

    saveDetails = event => {
      event.preventDefault()
      const defaultSite = pathOr('public', ['params', 'site'], this.props)
      const types = [this.feedbackNoteField, this.feedbackErrorField]
      this.setState({ state: 'loading' })
      createFeedback({
        type: types.filter(propEq('checked', true)).map(prop('value'))[0],
        site: defaultSite,
        pathname: window.location.pathname,
        email: this.emailField.value,
        description: this.descriptionField.value,
        'g-recaptcha-response': this.state.capthca
      })
        .then(() => this.setState({ state: 'finished' }))
        .catch(() => this.setState({ state: 'error' }))
    }

    private captchaUpdate = capthca => {
      this.setState({ capthca })
    }

    render() {
      const props = this.props
      return (
        <Dialog className="feedback">
          <DialogHeader onClose={props.close}>Visszajelzés</DialogHeader>
          <form onSubmit={this.saveDetails}>
            <DialogBody>{this.renderContent()}</DialogBody>
            <DialogFooter>{this.renderFooter()}</DialogFooter>
          </form>
        </Dialog>
      )
    }

    renderContent() {
      switch (this.state.state) {
        case 'init':
          return this.renderForm()
        case 'loading':
          return (
            <div className="msg-block">
              <Loading />
            </div>
          )
        case 'finished':
          return <div className="msg-block">Köszönjük a visszajelzést.</div>
        case 'error':
          return (
            <div className="msg-block text-danger">
              Nem várt hiba törtétn.
              <br /> Kérlek próbáld újra később
            </div>
          )
      }
    }

    renderFooter() {
      switch (this.state.state) {
        case 'init':
          return (
            <div>
              <Button onAction={this.props.close}>Mégsem</Button>
              &nbsp;
              <Button submit primary disabled={!this.state.capthca}>
                Küldés
              </Button>
            </div>
          )
        case 'loading':
          return <div />
        case 'finished':
          return (
            <div>
              <Button onAction={this.props.close}>Bezárás</Button>
            </div>
          )
      }
    }

    renderForm() {
      const props = this.props
      const defaultType = pathOr('note', ['params', 'note'], props)
      const email = pathOr(false, ['session', 'user', 'email'], props)

      return (
        <div>
          <div className="form-group">
            <div className="custom-control custom-radio">
              <input
                id="id-feedback-type-1"
                name="feedbackType"
                type="radio"
                value="note"
                className="custom-control-input"
                required
                defaultChecked={defaultType === 'note'}
                ref={inp => {
                  this.feedbackNoteField = inp
                }}
              />
              <label className="custom-control-label">Megjegyzés</label>
            </div>
            <div className="custom-control custom-radio">
              <input
                id="id-feedback-type-2"
                name="feedbackType"
                type="radio"
                className="custom-control-input"
                value="error"
                required
                defaultChecked={defaultType === 'error'}
                ref={inp => {
                  this.feedbackErrorField = inp
                }}
              />
              <label className="custom-control-label">Hibabejelentés</label>
            </div>
          </div>
          <div className="form-group">
            <input
              type="mail"
              id="id-feedback-email"
              name="email"
              className="form-control"
              placeholder="E-mail cím"
              defaultValue={email !== false ? email : ''}
              required
              readOnly={email !== false}
              ref={inp => {
                this.emailField = inp
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="feedback-txt">Leírás</label>
            <textarea
              id="id-feedback-txt"
              className="form-control"
              required
              name="description"
              rows={10}
              maxLength={1024}
              ref={inp => {
                this.descriptionField = inp
              }}
            />
          </div>
          <ReCAPTCHA sitekey={__CONFIG__.recaptcha.siteKey} onChange={this.captchaUpdate} />
        </div>
      )
    }
  }
)

// default export for dynamic import
export default FeedbackModal
