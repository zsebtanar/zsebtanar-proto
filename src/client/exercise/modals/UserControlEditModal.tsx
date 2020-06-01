import React from 'react'
import { useDialog } from '../../overlay/providers'
import { Dialog, DialogHeader, DialogBody, DialogFooter } from 'client/overlay/components'
import { ExerciseSubTaskControlsType } from 'shared/exercise/types'
import { Button } from 'client/generic/components'
import { useModel } from '../../generic/hooks/model'
import { SimpleTextAdmin } from '../components/userControls/simpleText/SimpleTextAdmin'

interface Props {
  value: ExerciseSubTaskControlsType
}

export function UserControlEditModal({ value }: Props) {
  const { closeModal } = useDialog()
  const { bindPartialModel, data } = useModel<ExerciseSubTaskControlsType>({ value })

  const close = () => closeModal()
  const store = (data: unknown) => closeModal(data)

  return (
    <Dialog className="feedback">
      <DialogHeader onClose={close}>Mezőszerkesztés</DialogHeader>
      <form onSubmit={() => store(data)}>
        <DialogBody>
          <SimpleTextAdmin {...bindPartialModel()} />
        </DialogBody>
        <DialogFooter>
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
