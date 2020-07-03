import React from 'react'
import { useDialog } from '../providers/DialogProvider'
import { DialogHeader } from './base/DialogHeader'
import { Dialog } from './base/Dialog'
import { DialogBody } from './base/DialogBody'
import { DialogFooter } from './base/DialogFooter'
import { Button } from 'client/generic/components/Button'

interface Props {
  title?: string
  buttonType?: ButtonType
  children: React.ReactNode
}

export function ConfirmModal({ children, title, buttonType }: Props): JSX.Element {
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
