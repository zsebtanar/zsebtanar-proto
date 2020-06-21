import React from 'react'
import { useLoadClassifications } from '../services/classificationService'
import { Loading, Alert, Button, FormCard } from '../../generic/components'
import { sortByProp } from '../../../shared/utils/fn'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit } from '@fortawesome/free-solid-svg-icons'
import { useOverlayDispatch } from '../../overlay/providers'
import { UpdateClassificationModal } from '../modals/UpdateClassificationModal'

import './ClassificationsAdmin.scss'

export function ClassificationsAdminPage() {
  const { isLoading, isPending, isSuccess, result, hasError, error } = useLoadClassifications()
  const { openModal } = useOverlayDispatch()

  const create = () =>
    openModal(<UpdateClassificationModal value={{ key: undefined, value: undefined }} />, true)

  const update = (key, value) =>
    openModal(<UpdateClassificationModal value={{ key, value }} />, true)

  return (
    <div className=" classification-page bg-light">
      <div className="container">
        <FormCard>
          <div className="btn-toolbar justify-content-between align-items-center">
            <h3>Feladat címkék</h3>
            <Button btn="primary" onAction={create}>
              <FontAwesomeIcon icon={faPlus} /> Új címke felvétel
            </Button>
          </div>
          <hr />

          {(isPending || isLoading) && <Loading />}
          {hasError && <Alert type={'danger'}>Hiba: {JSON.stringify(error)}</Alert>}
          {isSuccess && result && (
            <dl className="row">
              {Object.entries(result)
                .filter(([key]) => key !== 'id')
                .sort(sortByProp(0))
                .map(([key, value]) => (
                  <React.Fragment key={key}>
                    <dt className="col-sm-6 text-right">{key}</dt>
                    <dd className="col-sm-6">
                      {value}{' '}
                      <Button small btn="link" onAction={() => update(key, value)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                    </dd>
                  </React.Fragment>
                ))}
            </dl>
          )}
        </FormCard>
      </div>
    </div>
  )
}
