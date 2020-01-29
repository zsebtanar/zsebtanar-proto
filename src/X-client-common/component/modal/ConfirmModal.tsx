import * as React from 'react'
import { Button } from 'client/generic/components/Button'
import { Dialog } from '../../../client/modal/components/modal/Dialog'
import { DialogBody } from '../../../client/modal/components/modal/DialogBody'
import { DialogHeader } from '../../../client/modal/components/modal/DialogHeader'
import { DialogFooter } from '../../../client/modal/components/modal/DialogFooter'

export interface ConfirmModalParams {
  title?: string
  onSuccess?: () => void
  buttonType?: ButtonType
  content: React.ReactNode
}

interface ConfirmModalProps extends ui.ModalProps, ConfirmModalParams {}

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
