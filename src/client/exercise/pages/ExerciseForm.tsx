import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { useParams, useHistory } from 'react-router'
import { PocketLispProvider } from 'client/script/providers/PocketLispProvider'
import { useExerciseModel } from '../services/exercise'
import { ExerciseFormDetails } from '../components/form/ExerciseFormDetails'
import { ExerciseFormSubTask } from '../components/form/ExerciseFormSubTasks'
import {
  AssetManagerProvider,
  useManageAssetsDispatch,
} from 'client/assets/providers/ManageAssetProvider'
import { AssetGroup } from 'shared/assets/types'
import { useQuery } from 'client/generic/hooks/navigation'
import { Loading } from 'client/generic/components/Loading'
import { Alert } from 'client/generic/components/Alert'
import { Button } from 'client/generic/components/Button'

import './ExerciseForm.scss'

export function ExerciseForm(): JSX.Element {
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
    save,
    error,
  } = useExerciseModel(id)
  const { selectGroup, unSelectGroup } = useManageAssetsDispatch()

  useEffect(() => {
    selectGroup(AssetGroup.Exercise)
    return () => unSelectGroup()
  }, [])

  if (isPending || isFetching) {
    return <Loading />
  }

  const onSave = async (event) => {
    event.preventDefault()
    const saveClone = query.get('clone') !== null
    const res = await save(saveClone)
    if (res.id && res.id !== id) {
      history.replace(`/exercise/edit/${res.id}`)
    }
  }

  return (
    <AssetManagerProvider {...bind('assets')}>
      <PocketLispProvider isEdit={true} seed={1} script={data.script}>
        <div className="exercise-form bg-light">
          <form className="container" onSubmit={onSave}>
            {error && (
              <Alert type="danger">
                <h4>{error.message}</h4>
                <ul>
                  {error?.['details']?.errors.map((err, idx) => (
                    <li key={idx}>
                      {err?.path.toString()} - {err?.message}
                    </li>
                  ))}
                </ul>
              </Alert>
            )}
            <ExerciseFormDetails {...bindPartialModel()} />
            <hr />
            <h5>
              Részfeldatok{' '}
              <Button
                small
                btn="link"
                onAction={() =>
                  append('subTasks', {
                    title: '',
                    description: '',
                    controls: [],
                    hints: [],
                  })
                }
              >
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
      </PocketLispProvider>
    </AssetManagerProvider>
  )
}
