import React from 'react'
import { useDialog } from '../../overlay/providers'
import { Dialog, DialogHeader, DialogBody, DialogFooter } from 'client/overlay/components'
import { ExerciseSubTaskControlsType } from 'shared/exercise/types'
import { Button } from 'client/generic/components'
import { useModel } from '../../generic/hooks/model'
import { UserControlsAdmin } from '../components/userControls/UserControlAdmin'
import { PocketLispProvider } from '../../script/providers/PocketLispProvider'

interface Props {
  value: ExerciseSubTaskControlsType
  scriptSource: string
}

export function UserControlEditModal({ value, scriptSource }: Props) {
  const { closeModal } = useDialog()
  const { bindPartialModel, data } = useModel<ExerciseSubTaskControlsType>({ value })

  const close = () => closeModal()
  const store = (data: unknown) => closeModal(data)

  return (
    <Dialog className="feedback">
      <DialogHeader onClose={close}>Mezőszerkesztés</DialogHeader>
      <form onSubmit={() => store(data)}>
        <DialogBody>
          <PocketLispProvider isEdit={true} seed={1} script={scriptSource}>
            <UserControlsAdmin {...bindPartialModel()} />
          </PocketLispProvider>
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
