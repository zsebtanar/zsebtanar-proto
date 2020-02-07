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
  const { closeModal } = useDialog()

  const close = () => closeModal()
  const cancel = () => closeModal(false)
  const ok = () => closeModal(true)

  return (
    <Dialog className="confirm">
      {title && <DialogHeader onClose={close}>{title}</DialogHeader>}
      <DialogBody>{children}</DialogBody>
      <DialogFooter>
        <Button onAction={cancel} btn="link">
          Mégsem
        </Button>
        <Button onAction={ok} btn={buttonType}>
          Rendben
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
