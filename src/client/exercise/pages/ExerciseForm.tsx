import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { useParams, useHistory } from 'react-router'
import { Loading, Button } from '../../generic/components'
import { PocketLispProvider } from 'client/script/providers/PocketLispProvider'
import { useExerciseModel } from '../services/exercise'
import { ExerciseFormDetails } from '../components/form/ExerciseFormDetails'
import { ExerciseFormSubTask } from '../components/form/ExerciseFormSubTasks'
import {
  AssetManagerProvider,
  useManageAssetsDispatch
} from 'client/assets/providers/ManageAssetProvider'
import { AssetGroup } from 'shared/assets/types'
import { useQuery } from '../../generic/hooks'

import './ExerciseForm.scss'

export function ExerciseForm() {
  const history = useHistory()
  const { id } = useParams()
  const query = useQuery()
  const {
    data,
    bind,
    bindPartialModel,
    append,
    remove,
    isFetching,
    isPending,
    isSaving,
    save
  } = useExerciseModel(id)
  const { selectGroup, unSelectGroup } = useManageAssetsDispatch()

  useEffect(() => {
    selectGroup(AssetGroup.Exercise)
    return () => unSelectGroup()
  }, [])

  if (isPending || isFetching) {
    return <Loading />
  }

  const onSave = async event => {
    event.preventDefault()
    const res = await save(query.get('clone') !== null)
    if (res.id && res.id !== id) {
      history.replace(`/exercise/edit/${res.id}`)
    }
  }

  return (
    <PocketLispProvider isEdit={true} seed={1} script={data.script}>
      <AssetManagerProvider {...bind('assets')}>
        <div className="exercise-form bg-light">
          <form className="container" onSubmit={onSave}>
            <ExerciseFormDetails {...bindPartialModel()} />
            <hr />
            <h5>
              Részfeldatok{' '}
              <Button small btn="link" onAction={() => append('subTasks', {})}>
                <FontAwesomeIcon icon={faPlusCircle} /> Rész feladat
              </Button>
            </h5>
            {data.subTasks?.map((subTask, idx) => (
              <ExerciseFormSubTask
                key={idx}
                index={idx}
                {...bind(`subTasks.${idx}`)}
                onRemove={() => remove(`subTasks.${idx}`)}
              />
            ))}

            <div className="row my-3">
              <div className="col-12 d-flex justify-content-end">
                <Button submit btn="primary" loading={isSaving} onAction={onSave}>
                  Mentés
                </Button>
              </div>
            </div>
          </form>
        </div>{' '}
      </AssetManagerProvider>
    </PocketLispProvider>
  )
}
