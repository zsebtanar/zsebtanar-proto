import React from 'react'
import { Button } from 'client/generic/components/Button'
import { Dialog, DialogHeader, DialogBody, DialogFooter } from './base'
import { useInput } from 'client/generic/hooks'
import { useDialog } from 'client/overlay/providers'

///

interface Props {
  title?: string
  buttonType?: ButtonType
  children?: React.ReactNode
  value?: string
  label: string
}

///

export function TextPromptModal({ title, children, label, value, buttonType }: Props) {
  const { closeDialog } = useDialog()
  const { value: text, bind: bindText } = useInput(value)

  const close = () => closeDialog()

  return (
    <Dialog className="confirm">
      {title && <DialogHeader onClose={close}>{title}</DialogHeader>}
      <DialogBody>
        {children}
        <div className="form-group">
          <label htmlFor="id=text-prompt-modal">{label}</label>
          <input
            autoFocus
            id="id=text-prompt-modal"
            type="text"
            className="form-control"
            required
            {...bindText}
          />
        </div>
      </DialogBody>
      <DialogFooter>
        <Button onAction={close} className="btn-link">
          Mégsem
        </Button>
        <Button onAction={() => closeDialog(text)} btn={buttonType}>
          Rendben
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
