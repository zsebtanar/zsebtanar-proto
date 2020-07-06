import React from 'react'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from '../../generic/components/Button'
import { cloudFnGet } from '../../generic/services/firebase'
import { useOverlayDispatch } from '../../overlay/providers/OverlayProvider'
import { ConfirmModal } from '../../overlay/components/ConfirmModal'

export function AdminUtils(): JSX.Element {
  const { openModal } = useOverlayDispatch()

  const confirm = (fn) =>
    openModal(<ConfirmModal>Biztos?!</ConfirmModal>).then((res) => (res ? fn() : undefined))

  const reIndexSearch = () =>
    confirm(() => cloudFnGet('/support/re-index-search', {}, { withToken: true }))

  return (
    <div className="container">
      <div className="alert alert-warning col-8 mx-auto">
        <h4>
          <FontAwesomeIcon icon={faExclamationTriangle} size="2x" /> Vigyázz, veszélyes terület
        </h4>
        <div className="mx-5">
          Jól gondold át mielőtt használod ezeket a funkciókat.
          <br /> Mindig konzultálj a fejlesztőkkel előbb.
        </div>
      </div>

      <ul className="list-unstyled">
        <li>
          <Button onAction={reIndexSearch}>Re-index algolia search</Button>
        </li>
      </ul>
    </div>
  )
}
