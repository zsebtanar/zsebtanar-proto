import React from 'react'
import { Button } from '../../generic/components'
import { useDialog } from '../providers'
import { Dialog, DialogHeader, DialogBody, DialogFooter } from './base'

interface Props {
  title?: string
  buttonType?: ButtonType
  children: React.ReactNode
}

export function ConfirmModal({ children, title, buttonType }: Props) {
  const { closeDialog } = useDialog()

  const close = () => closeDialog()
  const cancel = () => closeDialog(false)
  const ok = () => closeDialog(true)

  return (
    <Dialog className="confirm">
      {title && <DialogHeader onClose={close}>{title}</DialogHeader>}
      <DialogBody>{children}</DialogBody>
      <DialogFooter>
        <Button onAction={cancel} className="btn-link">
          Mégsem
        </Button>
        <Button onAction={ok} className={`btn-${buttonType || 'primary'}`}>
          Rendben
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
