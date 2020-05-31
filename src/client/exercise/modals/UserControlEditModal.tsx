import React from 'react'
import { useDialog } from '../../overlay/providers'
import { Dialog, DialogHeader, DialogBody, DialogFooter } from 'client/overlay/components'
import { ExerciseSubTaskControlsType, UserControl } from 'shared/exercise/types'
import { Button } from 'client/generic/components'

interface Props {
  controlType: ExerciseSubTaskControlsType
  controlData: UserControl
  name: string
  onChange: ({ name: string, value: UserControl }) => void
}

export function UserControlEditModal({ controlType, controlData, onChange, name }: Props) {
  const { closeModal } = useDialog()

  const close = () => closeModal()

  return (
    <Dialog className="feedback">
      <DialogHeader onClose={close}>Mezőszerkesztés</DialogHeader>
      <form onSubmit={() => onChange({ name, value: controlData })}>
        <DialogBody>Meh</DialogBody>
        <DialogFooter>
          {' '}
          <div>
            <Button onAction={close}>Mégsem</Button>
            &nbsp;
            <Button submit btn="primary">
              Ok
            </Button>
          </div>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
