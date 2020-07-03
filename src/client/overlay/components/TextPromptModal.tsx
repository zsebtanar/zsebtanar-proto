import React from 'react'
import { Button } from 'client/generic/components/Button'
import { useDialog } from '../providers/DialogProvider'
import { useInput } from '../../generic/hooks/input'
import { Dialog } from './base/Dialog'
import { DialogHeader } from './base/DialogHeader'
import { DialogBody } from './base/DialogBody'
import { DialogFooter } from './base/DialogFooter'

///

interface Props {
  title?: string
  buttonType?: ButtonType
  children?: React.ReactNode
  value?: string
  label: string
}

///

export function TextPromptModal({ title, children, label, value, buttonType }: Props): JSX.Element {
  const { closeModal } = useDialog()
  const { value: text, bind: bindText } = useInput(value)

  const close = () => closeModal()

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
        <Button onAction={() => closeModal(text)} btn={buttonType}>
          Rendben
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
