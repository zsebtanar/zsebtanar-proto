import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { ExerciseFormBlock } from '../components/ExerciseFormBlock'
import { TextEditor } from '../../generic/components/form/input/TextEditor'
import { MultiSelectCombobox } from '../../generic/components/MultiSelectCombobox'
import { useLoadClassifications } from '../../categories/services/classificationService'
import { sortByProp } from '../../../shared/utils/fn'
import { CodeEditor } from '../../script/components/CodeEditor'
import { PocketLispProvider } from 'client/script/providers/PocketLispProvider'
import { exerciseDataService, useExerciseModel } from '../services/exercise'
import { Loading, Button, Dropdown, DropdownToggle, DropdownMenu } from '../../generic/components'
import { MarkdownWithScript } from '../../script/components/MarkdownWithCode'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { NAMES as userControlNames } from '../components/userControls/controlTypes'
import { UserControlEditModal } from '../modals/UserControlEditModal'
import { useOverlayDispatch } from '../../overlay/providers'

import './ExerciseForm.scss'

export function ExerciseForm() {
  const { id } = useParams()
  const { openModal } = useOverlayDispatch()
  const classifications = useLoadClassifications()
  const {
    model,
    create,
    load,
    isFetching,
    isPending,
    set,
    append,
    store,
    isSaving
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

  const update = event => {
    const { name, value } = event.target ? event.target : event
    set(name, value)
  }

  const onSave = () => {
    if (!isSaving) {
      store()
    }
  }

  const editUserControl = (controlType, controlData = {}) =>
    openModal(
      <UserControlEditModal
        name="hello"
        controlType={controlType}
        controlData={controlData as any}
        onChange={() => undefined}
      />
    )

  const newSubTask = () => set('subTasks', [...(model.subTasks ?? []), {}])

  return (
    <PocketLispProvider isEdit={true} seed={1}>
      <div className="exercise-form bg-light">
        <form className="container" onSubmit={onSave}>
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
                id="exercise-description"
                value={model.description}
                name="description"
                resources={{}}
                onChange={update}
                preview={MarkdownWithScript}
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
          <hr />
          <h5>
            Részfeldatok{' '}
            <Button small btn="link" onAction={newSubTask}>
              <FontAwesomeIcon icon={faPlusCircle} /> Rész feladat
            </Button>
          </h5>
          {model.subTasks?.map((subTask, idx) => (
            <ExerciseFormBlock className="card my-3" key={idx}>
              <div className="form-group">
                <label htmlFor={`exercise-subtask-${idx}-description`}>Leírása</label>
                <TextEditor
                  id={`exercise-subtask-${idx}-description`}
                  value={model.subTasks[idx].description}
                  name={`subTasks.${idx}.description`}
                  resources={{}}
                  onChange={update}
                  preview={MarkdownWithScript}
                />
              </div>
              <hr />
              <h6>
                Mezők{' '}
                <Dropdown elementType="div" className="d-inline-block">
                  <DropdownToggle className="btn-link btn-sm">
                    <FontAwesomeIcon icon={faPlusCircle} /> Mező hozzáadása
                  </DropdownToggle>
                  <DropdownMenu>
                    {Object.entries(userControlNames).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        className="dropdown-item"
                        onClick={() => editUserControl(key)}
                      >
                        {label}
                      </button>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </h6>{' '}
              <hr />
              <h6>
                Segítségek{' '}
                <Button small btn="link" onAction={() => append(`subTasks.${idx}.hints`, '')}>
                  <FontAwesomeIcon icon={faPlusCircle} /> Segítség hozzáadása
                </Button>
              </h6>
              {subTask.hints?.map((hint, hintIdx) => (
                <div className="form-group" key={hintIdx}>
                  <label htmlFor={`exercise-subtask-${idx}-hint-${hintIdx}`}>
                    {hintIdx + 1}. segítség
                  </label>
                  <TextEditor
                    id={`exercise-subtask-${idx}-hint-${hintIdx}`}
                    value={model.subTasks[idx].hints[hintIdx]}
                    name={`subTasks.${idx}.hints.${hintIdx}`}
                    resources={{}}
                    onChange={update}
                    preview={MarkdownWithScript}
                  />
                </div>
              ))}
            </ExerciseFormBlock>
          ))}

          <div className="row my-3">
            <div className="col-12 d-flex justify-content-end">
              <Button
                submit
                btn="primary"
                loading={isSaving}
                onAction={() => exerciseDataService.store(model)}
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
