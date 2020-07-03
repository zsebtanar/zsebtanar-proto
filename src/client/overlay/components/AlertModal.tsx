import React from 'react'
import { DialogSize } from '../types'
import { useDialog } from '../providers/DialogProvider'
import { Dialog } from './base/Dialog'
import { DialogHeader } from './base/DialogHeader'
import { DialogBody } from './base/DialogBody'
import { DialogFooter } from './base/DialogFooter'
import { Button } from 'client/generic/components/Button'

interface Props {
  title?: string
  buttonType?: ButtonType
  children: React.ReactNode
  size?: DialogSize
}

export function AlertModal({ size, children, buttonType, title }: Props): JSX.Element {
  const { closeModal } = useDialog()

  const close = () => closeModal()

  return (
    <Dialog className="alert" size={size}>
      {title && <DialogHeader onClose={close}>{title}</DialogHeader>}
      <DialogBody>{children}</DialogBody>
      <DialogFooter>
        <Button onAction={close} btn={buttonType}>
          Rendben
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
