import React from 'react'
import { useDialog } from '../../overlay/providers/DialogProvider'
import { useModel } from 'client/generic/hooks/model'
import { Dialog } from 'client/overlay/components/base/Dialog'
import { DialogHeader } from 'client/overlay/components/base/DialogHeader'
import { DialogBody } from 'client/overlay/components/base/DialogBody'
import { FormGroup } from 'client/generic/components/form/FormGroup'
import { Input } from 'client/generic/components/form/input/Input'
import { DialogFooter } from 'client/overlay/components/base/DialogFooter'
import { Button } from 'client/generic/components/Button'

interface ClassificationItem {
  key?: string
  value?: string
}

interface Props {
  value: ClassificationItem
}

export function UpdateClassificationModal({ value }: Props): JSX.Element {
  const { closeModal } = useDialog()
  const { bind, data } = useModel<ClassificationItem>({ value })
  const isNew = !value.key

  const close = () => closeModal()
  const store = (data: unknown) => closeModal(data)

  return (
    <Dialog className="feedback">
      <DialogHeader onClose={close}>{isNew ? 'Új kategória' : 'Kategória módosítása'}</DialogHeader>
      <form onSubmit={() => store(data)}>
        <DialogBody>
          <FormGroup label="ID">
            {(id) => (
              <Input
                type="text"
                className="form-control"
                id={id}
                {...bind('key')}
                disabled={!isNew}
                pattern="[a-z0-9/]+"
              />
            )}
          </FormGroup>
          <FormGroup label="Név">
            {(id) => <Input type="text" className="form-control" id={id} {...bind('value')} />}
          </FormGroup>
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
