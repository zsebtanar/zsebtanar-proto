import React, { useEffect } from 'react'
import { PlayCircle as PlayCircleIcon, AlertTriangle as AlertTriangleIcon } from 'react-feather'
import { useParams, useHistory } from 'react-router'
import { PocketLispProvider } from 'client/script/providers/PocketLispProvider'
import { useExerciseModel, changeState } from '../services/exercise'
import { ExerciseFormDetails } from '../components/form/ExerciseFormDetails'
import { ExerciseFormSubTask } from '../components/form/ExerciseFormSubTasks'
import {
  AssetManagerProvider,
  useManageAssetsDispatch,
} from 'client/asset/providers/ManageAssetProvider'
import { AssetGroup } from 'shared/assets/types'
import { ExerciseState } from 'shared/exercise/types'
import { useQuery } from 'client/generic/hooks/navigation'
import { Loading } from 'client/generic/components/Loading'
import { Alert } from 'client/generic/components/Alert'
import { Button } from 'client/generic/components/Button'
import { ClassificationProvider } from 'client/classification/provider/ClassificationProvider'
import { ExerciseStateBadge } from '../components/form/ExerciseStateBadge'
import { ExerciseOperations } from './ExerciseOperations'

import './ExerciseForm.scss'
import { Icon } from '../../generic/components/icons/Icon'

export function ExerciseForm(): JSX.Element {
  const history = useHistory()
  const { id } = useParams<{ id: string }>()
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
    reload,
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
    const res = await save(isClone)
    if (res.id && res.id !== id) {
      history.replace(`/exercise/edit/${res.id}`)
    }
  }

  const handleStateChange = async (es: ExerciseState) => {
    await changeState(id, es)
    if (es === ExerciseState.Remove) {
      history.replace(`/exercise`)
    } else {
      reload()
    }
  }

  const isNotNew = id !== undefined
  const isClone = query.get('clone') !== null

  if (error) {
    return (
      <div className="exercise-form bg-light">
        <Alert type="danger" className="container">
          <h4>{error.message}</h4>
          <ul>
            {error?.['details']?.errors.map((err, idx) => (
              <li key={idx}>
                {err?.path.toString()} - {err?.message}
              </li>
            ))}
          </ul>
        </Alert>
      </div>
    )
  }

  return (
    <AssetManagerProvider {...bind('assets')}>
      <PocketLispProvider isEdit={true} seed={1} script={data.script}>
        <ClassificationProvider>
          <div className="exercise-form bg-light">
            <form className="container" onSubmit={onSave}>
              <div className="container main-controls">
                <div className="col-12 d-flex justify-content-between align-items-center">
                  <div>
                    <ExerciseStateBadge value={isClone ? ExerciseState.Clone : data.state} />
                  </div>
                  <div className="d-flex">
                    {isNotNew && !isClone && (
                      <ExerciseOperations exercise={data} onAction={handleStateChange} />
                    )}

                    <Button
                      submit
                      small
                      className="ml-2"
                      btn="primary"
                      loading={isSaving}
                      onAction={onSave}
                    >
                      Mentés
                    </Button>
                  </div>
                </div>
              </div>
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
                  <Icon icon={PlayCircleIcon} /> Rész feladat
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
            </form>
          </div>
        </ClassificationProvider>
      </PocketLispProvider>
    </AssetManagerProvider>
  )
}
