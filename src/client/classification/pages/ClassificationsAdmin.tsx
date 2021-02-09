import React from 'react'
import {
  useLoadClassifications,
  remove as removeClassification,
} from '../services/classificationService'
import { sortByProp, map2list } from 'shared/utils/fn'
import { Plus as PlusIcon, Edit as EditIcon, Trash2 as TrashIcon } from 'react-feather'
import { Icon } from 'client/generic/components/icons/Icon'
import { UpdateClassificationModal } from '../modals/UpdateClassificationModal'
import { useOverlayDispatch } from '../../overlay/providers/OverlayProvider'
import { FormCard } from 'client/generic/components/form/FormCard'
import { Button } from 'client/generic/components/Button'
import { Loading } from 'client/generic/components/Loading'
import { Alert } from 'client/generic/components/Alert'
import { Badge } from '../../generic/components/Badge'
import { ClassificationSummaryDoc, ClassificationSummaryDocItem } from 'shared/classification/type'
import { ConfirmModal } from '../../overlay/components/ConfirmModal'

import './ClassificationsAdmin.scss'

export function ClassificationsAdminPage(): JSX.Element {
  const { isLoading, isPending, isSuccess, result, hasError, error } = useLoadClassifications()
  const { openModal } = useOverlayDispatch()

  const clsList = map2list(result || {}, 'id').sort(sortByProp('id'))

  const create = () => openModal(<UpdateClassificationModal />, true)

  const update = (cls: ClassificationSummaryDoc) =>
    openModal(<UpdateClassificationModal value={cls} />, true)

  const remove = (cls: ClassificationSummaryDocItem) => {
    if (!cls.id) return
    openModal(
      <ConfirmModal>
        Biztos törlöd a kategóriát?
        <br />
        Jelenleg {cls.exerciseCount} feladathoz van hozzárendelve.
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
              <Icon icon={PlusIcon} /> Új címke felvétel
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
                {clsList.map((cls) => (
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
                        <Icon icon={EditIcon} />
                      </Button>
                      <Button small btn="link" onAction={() => remove(cls)}>
                        <Icon icon={TrashIcon} />
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
