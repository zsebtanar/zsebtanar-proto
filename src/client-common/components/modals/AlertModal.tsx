import React from 'react'
import { Button } from '../generic'
import { Dialog, DialogHeader, DialogBody, DialogFooter } from './base'
import { useDialog } from '../../providers/DialogProvider'

interface Props {
  title?: string
  buttonType?: ButtonType
  children: React.ReactNode
}

export function AlertModal({ children, buttonType, title }: Props) {
  const { closeDialog } = useDialog()

  const close = () => closeDialog()

  return (
    <Dialog className="alert">
      {title && <DialogHeader onClose={close}>{title}</DialogHeader>}
      <DialogBody>{children}</DialogBody>
      <DialogFooter>
        <Button onAction={close} className={`btn-${buttonType || 'primary'}`}>
          Rendben
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
