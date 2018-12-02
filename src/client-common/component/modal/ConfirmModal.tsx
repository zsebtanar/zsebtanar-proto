import * as React from 'react'
import { Button } from '../general/Button'
import { Dialog } from './base/Dialog'
import { DialogBody } from './base/DialogBody'
import { DialogHeader } from './base/DialogHeader'
import { DialogFooter } from './base/DialogFooter'

interface ConfirmModalProps extends ui.ModalProps {
  onSuccess: () => void
  buttonType?: ButtonType
  content: React.ReactNode
}

export function ConfirmModal(props: ConfirmModalProps) {
  const onOk = () => {
    props.onSuccess()
    props.close()
  }

  return (
    <Dialog className="confirm">
      {props.title && <DialogHeader onClose={props.close}>{props.title}</DialogHeader>}
      <DialogBody>{props.content}</DialogBody>
      <DialogFooter>
        <Button onAction={props.close} className="btn-link">
          Mégsem
        </Button>
        <Button onAction={onOk} className={`btn-${props.buttonType || 'primary'}`}>
          Rendben
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

// default export for dynamic import
export default ConfirmModal