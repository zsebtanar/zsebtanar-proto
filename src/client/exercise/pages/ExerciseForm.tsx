import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { useParams } from 'react-router'
import { Loading, Button } from '../../generic/components'
import { PocketLispProvider } from 'client/script/providers/PocketLispProvider'
import { exerciseDataService, useExerciseModel } from '../services/exercise'
import { ExerciseFormDetails } from '../components/form/ExerciseFormDetails'
import { ROOT } from '../../generic/hooks/model'
import { ExerciseFormSubTask } from '../components/form/ExerciseFormSubTasks'

import './ExerciseForm.scss'

export function ExerciseForm() {
  const { id } = useParams()
  const {
    data,
    create,
    load,
    isFetching,
    isPending,
    store,
    isSaving,
    bind,
    append
  } = useExerciseModel()

  useEffect(() => {
    if (id) {
      load(id)
    } else {
      create()
    }
  }, [id])

  if (isPending || isFetching) {
    return <Loading />
  }

  const onSave = () => {
    if (!isSaving) {
      store()
    }
  }

  return (
    <PocketLispProvider isEdit={true} seed={1}>
      <div className="exercise-form bg-light">
        <form className="container" onSubmit={onSave}>
          <ExerciseFormDetails {...bind(ROOT)} />
          <hr />
          <h5>
            Részfeldatok{' '}
            <Button small btn="link" onAction={() => append('subTasks', {})}>
              <FontAwesomeIcon icon={faPlusCircle} /> Rész feladat
            </Button>
          </h5>
          {data.subTasks?.map((subTask, idx) => (
            <ExerciseFormSubTask key={idx} {...bind(`subTasks.${idx}`)} />
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
      </div>
    </PocketLispProvider>
  )
}
