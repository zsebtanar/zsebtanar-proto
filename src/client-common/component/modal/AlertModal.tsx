import * as React from 'react'
import { Button } from '../general/Button'
import { Dialog } from './base/Dialog'
import { DialogBody } from './base/DialogBody'
import { DialogHeader } from './base/DialogHeader'
import { DialogFooter } from './base/DialogFooter'

interface AlertModalProps extends ui.ModalProps {
  buttonType?: ButtonType
  content: React.ReactNode
}

export function AlertModal(props: AlertModalProps) {
  return (
    <Dialog className="alert">
      {props.title && <DialogHeader onClose={props.close}>{props.title}</DialogHeader>}
      <DialogBody>{props.content}</DialogBody>
      <DialogFooter>
        <Button onAction={props.close} className={`btn-${props.buttonType || 'primary'}`}>
          Rendben
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

// default export for dynamic import
export default AlertModal