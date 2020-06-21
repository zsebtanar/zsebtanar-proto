import React from 'react'
import { useDialog } from '../../overlay/providers'
import { Dialog, DialogHeader, DialogBody, DialogFooter } from 'client/overlay/components'
import { Button, FormGroup, Input } from 'client/generic/components'
import { useModel } from '../../generic/hooks/model'

interface ClassificationItem {
  key?: string
  value?: string
}

interface Props {
  value: ClassificationItem
}

export function UpdateClassificationModal({ value }: Props) {
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
            {id => (
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
            {id => <Input type="text" className="form-control" id={id} {...bind('value')} />}
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
