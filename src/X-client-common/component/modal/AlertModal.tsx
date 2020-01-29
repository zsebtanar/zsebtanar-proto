import * as React from 'react'
import { Button } from 'client/generic/components/Button'
import { Dialog } from '../../../client/modal/components/modal/Dialog'
import { DialogBody } from '../../../client/modal/components/modal/DialogBody'
import { DialogHeader } from '../../../client/modal/components/modal/DialogHeader'
import { DialogFooter } from '../../../client/modal/components/modal/DialogFooter'

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
