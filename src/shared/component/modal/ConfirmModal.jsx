import React from 'react'
import { Button } from '../general/Button'
import { Dialog } from './base/Dialog'
import { DialogHeader } from './base/DialogHeader'
import { DialogBody } from './base/DialogBody'
import { DialogFooter } from './base/DialogFooter'

export function ConfirmModal(props) {
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
