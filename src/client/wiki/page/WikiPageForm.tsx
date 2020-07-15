import React, { useEffect } from 'react'
import { useParams, useHistory } from 'react-router'
import { NavLink } from 'react-router-dom'
import { faTrash, faSave } from '@fortawesome/free-solid-svg-icons'
import { AssetGroup } from 'shared/assets/types'
import { TextEditor } from 'client/generic/components/form/input/TextEditor'
import { useWikiPageModel, wikiPageService } from '../services/wikiPageService'
import { useManageAssetsDispatch } from '../../asset/providers/ManageAssetProvider'
import { Loading } from 'client/generic/components/Loading'
import { Alert } from 'client/generic/components/Alert'
import { FormCard } from 'client/generic/components/form/FormCard'
import { FormGroup } from 'client/generic/components/form/FormGroup'
import { Button } from 'client/generic/components/Button'
import { Input } from 'client/generic/components/form/input/Input'

import './WikiPageForm.scss'

export function WikiPageForm(): JSX.Element {
  const { id } = useParams()
  const history = useHistory()
  const { save, hasError, isPending, isFetching, isSaving, bind, error } = useWikiPageModel(id)

  const { selectGroup, unSelectGroup } = useManageAssetsDispatch()

  useEffect(() => {
    selectGroup(AssetGroup.Wiki)
    return () => unSelectGroup()
  }, [])

  if (isPending || isFetching) {
    return <Loading />
  }

  const onSave = (event) => {
    event.preventDefault()
    save()
  }

  const onDelete = async () => {
    await wikiPageService.delete(id)
    history.replace('wiki-page')
  }

  return (
    <form onSubmit={onSave} className="wiki-page-form bg-light">
      {isFetching ? (
        <Loading />
      ) : hasError ? (
        <Alert type={'danger'}>{JSON.stringify(error)}</Alert>
      ) : (
        <div className="container">
          <h4 className="d-inline-block m-0 mr-1">Wiki oldal</h4>
          <FormCard>
            <FormGroup label="Cím">
              {(id) => (
                <Input id={id} {...bind('title')} className="form-control" type="text" required />
              )}
            </FormGroup>

            <FormGroup label="Tartalom">
              {(id) => (
                <TextEditor
                  id={id}
                  {...bind('content')}
                  className="form-group"
                  rows={10}
                  required
                />
              )}
            </FormGroup>
          </FormCard>
          <div className="d-flex justify-content-end my-3">
            <div>
              {id && (
                <Button btn="link" className="text-danger" onAction={onDelete} icon={faTrash}>
                  Törlés
                </Button>
              )}
              <NavLink exact to="/wiki-page" className="btn btn-link">
                Mégsem
              </NavLink>
              <Button btn="primary" className="ml-1" loading={isSaving} submit icon={faSave}>
                Mentés
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}
