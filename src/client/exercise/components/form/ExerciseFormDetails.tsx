import React from 'react'
import { Input, MultiSelectCombobox, TextEditor } from '../../../generic/components'
import { sortByProp } from 'shared/utils/fn'
import { MarkdownWithScript, CodeEditor } from '../../../script/components'
import { ExerciseFormBlock } from '../ExerciseFormBlock'
import { ExerciseModel } from 'shared/exercise/types'
import { useModel, OnChange } from '../../../generic/hooks/model'
import { useLoadClassifications } from '../../../categories/services/classificationService'

type Model = Pick<ExerciseModel, 'title' | 'classifications' | 'description' | 'script'>

interface Props {
  name: string
  value: Model
  onChange: OnChange<Model>
}

export function ExerciseFormDetails({ name, value, onChange }: Props) {
  const classifications = useLoadClassifications()
  const { bind } = useModel<Model>(value, name, onChange)

  return (
    <ExerciseFormBlock className="card">
      <div className="form-group">
        <label htmlFor="exercise-title">Feledat neve</label>
        <Input type="text" className="form-control" id="exercise-title" {...bind('title')} />
      </div>

      <div className="form-group">
        {classifications.isSuccess && (
          <MultiSelectCombobox
            label="Címkék"
            options={
              Object.entries(classifications.result || {})
                .map(([value, label]) => ({
                  value,
                  label
                }))
                .sort(sortByProp('label')) || []
            }
            {...bind<string[]>('classification')}
          />
        )}
      </div>
      <div className="form-group">
        <label htmlFor="exercise-description">Feledat leírása</label>
        <TextEditor
          id="exercise-description"
          resources={{}}
          preview={MarkdownWithScript}
          {...bind('description')}
        />
      </div>

      <div className="form-group">
        <label htmlFor="exercise-script">Script</label>
        <CodeEditor id="exercise-script" {...bind('script')} />
      </div>
    </ExerciseFormBlock>
  )
}
