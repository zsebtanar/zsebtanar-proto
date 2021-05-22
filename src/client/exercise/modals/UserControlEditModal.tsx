import React from 'react'
import { ExerciseSubTaskControlsType } from 'shared/exercise/types'
import { useModel } from 'client/generic/hooks/model'
import { PocketLispProvider } from 'client/script/providers/PocketLispProvider'
import { useDialog } from 'client/overlay/providers/DialogProvider'
import { DialogHeader } from 'client/overlay/components/base/DialogHeader'
import { Dialog } from 'client/overlay/components/base/Dialog'
import { DialogBody } from 'client/overlay/components/base/DialogBody'
import { DialogFooter } from 'client/overlay/components/base/DialogFooter'
import { Button } from 'client/generic/components/Button'
import { UserControlsAdmin } from '../components/userControls/UserControlAdmin'

interface Props {
  value: ExerciseSubTaskControlsType
  scriptSource: string
}

export function UserControlEditModal({ value, scriptSource }: Props): JSX.Element {
  const { closeModal } = useDialog()
  const { bindPartialModel, data } = useModel<ExerciseSubTaskControlsType>({ value })

  const close = () => closeModal()
  const store = (data: unknown) => closeModal(data)

  return (
    <Dialog className="user-controls-modal" size="large">
      <DialogHeader onClose={close}>Mezőszerkesztés</DialogHeader>
      <form onSubmit={() => store(data)}>
        <DialogBody>
          <PocketLispProvider isEdit={true} seed={1} script={scriptSource}>
            <UserControlsAdmin {...bindPartialModel([])} />
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
