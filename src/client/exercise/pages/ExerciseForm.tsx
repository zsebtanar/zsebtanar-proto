import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import * as dp from 'dot-prop-immutable'
import { ExerciseFormBlock } from '../components/ExerciseFormBlock'
import { TextEditor } from '../../generic/components/form/input/TextEditor'
import { MultiSelectCombobox } from '../../generic/components/MultiSelectCombobox'
import { useLoadClassifications } from '../../categories/services/classificationService'
import { sortByProp } from '../../../shared/utils/fn'
import { CodeEditor } from '../../script/components/CodeEditor'
import { PocketLispProvider } from 'client/script/providers/PocketLispProvider'
import { useLoadExercise, exerciseDataService } from '../services/exercise'
import { Loading, Button } from '../../generic/components'
import { ExerciseModel } from '../../../shared/exercise/types'
import './ExerciseForm.scss'

export function ExerciseForm() {
  const { id } = useParams()
  const classifications = useLoadClassifications()
  const exercise = useLoadExercise(id)
  const [model, setModel] = useState<ExerciseModel | undefined>(undefined)

  useEffect(() => {
    setModel(exercise.result)
  }, [exercise.result])

  if (!model) {
    return <Loading />
  }

  const update = event => {
    const { name, value } = event.target ? event.target : event
    setModel(state => dp.set(state, name, value))
  }

  return (
    <PocketLispProvider isEdit={true} seed={1}>
      <div className="exercise-form bg-light">
        <form className="container">
          <ExerciseFormBlock className="card">
            <div className="form-group">
              <label htmlFor="exercise-title">Feledat neve</label>
              <input
                type="text"
                name="title"
                className="form-control"
                id="exercise-title"
                value={model.title}
                onChange={update}
              />
            </div>

            <div className="form-group">
              <MultiSelectCombobox
                name="classification"
                label="Címkék"
                value={model.classifications}
                options={
                  Object.entries(classifications.result || {})
                    .map(([value, label]) => ({
                      value,
                      label
                    }))
                    .sort(sortByProp('label')) || []
                }
                onChange={update}
              />
            </div>
            <div className="form-group">
              <label htmlFor="exercise-description">Feledat leírása</label>
              <TextEditor
                value={model.description}
                name="description"
                resources={{}}
                onChange={update}
              />
            </div>

            <div className="form-group">
              <label htmlFor="exercise-script">Script</label>
              <CodeEditor
                name="script"
                id="exercise-script"
                value={model.script}
                onChange={update}
              />
            </div>
          </ExerciseFormBlock>
          <Button submit btn="primary" onAction={() => exerciseDataService.store(model)}>
            Mentés
          </Button>
        </form>
      </div>
    </PocketLispProvider>
  )
}
