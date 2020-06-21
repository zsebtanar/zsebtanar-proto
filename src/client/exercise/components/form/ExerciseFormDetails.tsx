import React from 'react'
import { Input, MultiSelectCombobox, TextEditor, FormGroup } from '../../../generic/components'
import { sortByProp } from 'shared/utils/fn'
import { MarkdownWithScript, CodeEditor } from '../../../script/components'
import { FormCard } from '../../../generic/components/form'
import { ExerciseModel } from 'shared/exercise/types'
import { useModel, UseModelProps } from '../../../generic/hooks/model'
import { useLoadClassifications } from '../../../categories/services/classificationService'

type Model = Pick<ExerciseModel, 'title' | 'classifications' | 'description' | 'script'>

export function ExerciseFormDetails({ name, value, onChange }: UseModelProps<Model>) {
  const classifications = useLoadClassifications()
  const { bind } = useModel<Model>({ value, onChange, name })

  return (
    <FormCard className="card">
      <FormGroup label="Feledat neve">
        {id => <Input type="text" className="form-control" id={id} {...bind('title')} />}
      </FormGroup>

      <div className="form-group">
        {classifications.isSuccess && (
          <MultiSelectCombobox
            label="Címkék"
            options={
              Object.entries(classifications.result || {})
                .map(([value, label]) => ({
                  value,
                  label,
                }))
                .sort(sortByProp('label')) || []
            }
            {...bind<string[]>('classifications')}
          />
        )}
      </div>
      <FormGroup label="Feledat leírása">
        {id => <TextEditor id={id} preview={MarkdownWithScript} {...bind('description')} />}
      </FormGroup>

      <FormGroup label="Script">{id => <CodeEditor id={id} {...bind('script')} />}</FormGroup>
    </FormCard>
  )
}
