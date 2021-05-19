import React from 'react'
import { useDialog } from '../../../overlay/providers/DialogProvider'
import { Dialog } from '../../../overlay/components/base/Dialog'
import { DialogBody } from '../../../overlay/components/base/DialogBody'
import { DialogFooter } from '../../../overlay/components/base/DialogFooter'
import { Button } from '../../../generic/components/Button'
import { useBackJourney } from '../../../generic/providers/BackJourneyProvider'

interface Props {
  reloadExercise: () => void
}

export function ExerciseDoneModal({ reloadExercise }: Props): JSX.Element {
  const { closeModal } = useDialog()
  const bj = useBackJourney()

  const reload = () => {
    closeModal()
    reloadExercise()
  }

  const back = () => {
    closeModal()
    bj.back(true)
  }
  return (
    <Dialog className="confirm">
      <DialogBody>
        <div className="text-center">
          <p className="heading-2">Gratulálok!</p>
          <p>Sikeresen megoldottad a feladatot!</p>
        </div>
      </DialogBody>
      <DialogFooter className="justify-content-center">
        <Button onAction={reload} btn="link">
          Újra
        </Button>
        <Button onAction={back} btn="link">
          Vissza
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
