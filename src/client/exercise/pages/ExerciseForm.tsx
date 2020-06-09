import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { useParams } from 'react-router'
import { Loading, Button } from '../../generic/components'
import { PocketLispProvider } from 'client/script/providers/PocketLispProvider'
import { exerciseDataService, useExerciseModel } from '../services/exercise'
import { ExerciseFormDetails } from '../components/form/ExerciseFormDetails'
import { ExerciseFormSubTask } from '../components/form/ExerciseFormSubTasks'
import { AssetProvider } from '../../assets/providers/AssetProvider'
import { AssetManagerProvider } from 'client/assets/providers/ManageAssetProvider'

import './ExerciseForm.scss'

export function ExerciseForm() {
  const { id } = useParams()
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

  if (isPending || isFetching) {
    return <Loading />
  }

  const onSave = event => {
    event.preventDefault()
    save()
  }

  return (
    <PocketLispProvider isEdit={true} seed={1}>
      <AssetManagerProvider {...bind('assets')}>
        <AssetProvider attachments={data.assets}>
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
                  <Button
                    submit
                    btn="primary"
                    loading={isSaving}
                    onAction={() => exerciseDataService.store(data)}
                  >
                    Mentés
                  </Button>
                </div>
              </div>
            </form>
          </div>{' '}
        </AssetProvider>
      </AssetManagerProvider>
    </PocketLispProvider>
  )
}
