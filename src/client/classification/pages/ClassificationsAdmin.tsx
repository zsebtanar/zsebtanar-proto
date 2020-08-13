import React from 'react'
import {
  useLoadClassifications,
  remove as removeClassification,
} from '../services/classificationService'
import { sortByProp } from 'shared/utils/fn'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { UpdateClassificationModal } from '../modals/UpdateClassificationModal'
import { useOverlayDispatch } from '../../overlay/providers/OverlayProvider'
import { FormCard } from 'client/generic/components/form/FormCard'
import { Button } from 'client/generic/components/Button'
import { Loading } from 'client/generic/components/Loading'
import { Alert } from 'client/generic/components/Alert'
import { Badge } from '../../generic/components/Badge'
import { ClassificationModel } from 'shared/classification/type'
import { ConfirmModal } from '../../overlay/components/ConfirmModal'

import './ClassificationsAdmin.scss'

export function ClassificationsAdminPage(): JSX.Element {
  const { isLoading, isPending, isSuccess, result, hasError, error } = useLoadClassifications()
  const { openModal } = useOverlayDispatch()

  const create = () => openModal(<UpdateClassificationModal />, true)

  const update = (cls: ClassificationModel) =>
    openModal(<UpdateClassificationModal value={cls} />, true)

  const remove = (cls: ClassificationModel) => {
    if (!cls.id) return
    openModal(
      <ConfirmModal>
        Biztos törlöd a kategóriát?
        <br />
        Jelenleg {cls.exercises?.length} feladathoz van hozzárendelve.
      </ConfirmModal>,
    ).then((res) => (res ? removeClassification(cls.id as string) : undefined))
  }

  return (
    <div className=" classification-page bg-light">
      <div className="container">
        <FormCard>
          <div className="btn-toolbar justify-content-between align-items-center mb-5">
            <h3>Feladat címkék</h3>
            <Button btn="primary" onAction={create}>
              <FontAwesomeIcon icon={faPlus} /> Új címke felvétel
            </Button>
          </div>

          {(isPending || isLoading) && <Loading />}
          {hasError && <Alert type={'danger'}>Hiba: {JSON.stringify(error)}</Alert>}
          {isSuccess && result && (
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Név</th>
                  <th>Azonosító</th>
                  <th>Feladatok</th>
                  <th>Műveletek</th>
                </tr>
              </thead>
              <tbody>
                {result.sort(sortByProp('id')).map((cls) => (
                  <tr key={cls.id}>
                    <td>{cls.label}</td>
                    <td>
                      <code>{cls.id}</code>
                    </td>
                    <td>
                      <Badge type="secondary">{cls.exercises.length ?? 0}</Badge>
                    </td>
                    <td>
                      <Button small btn="link" onAction={() => update(cls)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                      <Button small btn="link" onAction={() => remove(cls)}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </FormCard>
      </div>
    </div>
  )
}
