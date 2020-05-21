import React, { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { Button, Loading } from 'client/generic/components'
import { useRadio, useInput } from 'client/generic/hooks'
import { Recaptcha } from 'client/app-public/providers/Recaptcha'
import { Dialog, DialogHeader, DialogBody, DialogFooter } from 'client/overlay/components/base'
import { useUser } from 'client/user/providers/UserProvider'
import { useDialog } from 'client/overlay/providers'
import { createFeedback } from '../services/feedbackService'

enum FormStates {
  Init,
  Loading,
  Finished,
  Error
}

export function FeedbackModal() {
  const session = useUser()
  const { closeModal } = useDialog()
  const [formState, setFormState] = useState<FormStates>(FormStates.Init)
  const userEmail = session?.user?.email

  const [capthca, setCapthca] = useState<string>('')
  const { value: type, bind: bindType } = useRadio('')
  const { value: email, bind: bindEmail } = useInput(userEmail ?? '')
  const { value: description, bind: bindDesc } = useInput('')

  const close = () => closeModal()

  const saveDetails = async event => {
    event?.preventDefault()
    setFormState(FormStates.Loading)
    try {
      await createFeedback({
        type,
        email,
        description,
        // FIXME: add admin too
        site: 'public',
        pathname: window.location.pathname,
        'g-recaptcha-response': capthca
      })

      setFormState(FormStates.Finished)
    } catch (e) {
      setFormState(FormStates.Error)
    }
  }

  return (
    <Recaptcha>
      <Dialog className="feedback">
        <DialogHeader onClose={close}>Visszajelzés</DialogHeader>
        <form onSubmit={saveDetails}>
          <DialogBody>{renderContent()}</DialogBody>
          <DialogFooter>{renderFooter()}</DialogFooter>
        </form>
      </Dialog>
    </Recaptcha>
  )

  function renderContent() {
    switch (formState) {
      case FormStates.Init:
        return renderForm()
      case FormStates.Loading:
        return (
          <div className="msg-block">
            <Loading />
          </div>
        )
      case FormStates.Finished:
        return <div className="msg-block">Köszönjük a visszajelzést.</div>
      case FormStates.Error:
        return (
          <div className="msg-block text-danger">
            Nem várt hiba törtétn.
            <br /> Kérlek próbáld újra később
          </div>
        )
    }
  }

  function renderFooter() {
    switch (formState) {
      case FormStates.Init:
        return (
          <div>
            <Button onAction={close}>Mégsem</Button>
            &nbsp;
            <Button submit btn="primary" disabled={!capthca}>
              Küldés
            </Button>
          </div>
        )
      case FormStates.Loading:
        return <div />
      case FormStates.Finished:
        return (
          <div>
            <Button onAction={close}>Bezárás</Button>
          </div>
        )
    }
  }

  function renderForm() {
    const defaultType = 'note'
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
              {...bindType}
            />
            <label className="custom-control-label" htmlFor="id-feedback-type-1">
              Megjegyzés
            </label>
          </div>
          <div className="custom-control custom-radio">
            <input
              id="id-feedback-type-2"
              name="feedbackType"
              type="radio"
              className="custom-control-input"
              value="error"
              required
              defaultChecked={false}
              {...bindType}
            />
            <label className="custom-control-label" htmlFor="id-feedback-type-2">
              Hibabejelentés
            </label>
          </div>
        </div>
        <div className="form-group">
          <input
            type="mail"
            id="id-feedback-email"
            name="email"
            className="form-control"
            placeholder="E-mail cím"
            required
            readOnly={!!userEmail}
            {...bindEmail}
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
            {...bindDesc}
          />
        </div>
        <ReCAPTCHA sitekey={__CONFIG__.recaptcha.siteKey} onChange={setCapthca} />
        <p className="text-muted">
          <small>
            A visszejelzés űrlapot reCAPTCHA védi a Google{' '}
            <a href="https://www.google.com/policies/privacy/">adatvédelmi</a> és{' '}
            <a href="https://www.google.com/policies/terms/">általáos szerződési feltételi</a>{' '}
            szerint
          </small>
        </p>
      </div>
    )
  }
}
