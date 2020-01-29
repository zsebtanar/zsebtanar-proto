import React from 'react'
import { Button } from '../../generic/components'
import { Dialog, DialogHeader, DialogBody, DialogFooter } from './base'
import { useDialog } from '../providers'
import { DialogSize } from '../types'


interface Props {
  title?: string
  buttonType?: ButtonType
  children: React.ReactNode
  size?: DialogSize
}

export function AlertModal({size, children, buttonType, title }: Props) {
  const { closeDialog } = useDialog()

  const close = () => closeDialog()

  return (
    <Dialog className="alert" size={size}>
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
