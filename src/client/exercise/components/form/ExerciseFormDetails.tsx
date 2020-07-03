import React from 'react'
import { sortByProp } from 'shared/utils/fn'
import { ExerciseModel } from 'shared/exercise/types'
import { useModel, UseModelProps } from 'client/generic/hooks/model'
import { useLoadClassifications } from 'client/categories/services/classificationService'
import { FormCard } from 'client/generic/components/form/FormCard'
import { Input } from 'client/generic/components/form/input/Input'
import { MultiSelectCombobox } from 'client/generic/components/MultiSelectCombobox'
import { FormGroup } from 'client/generic/components/form/FormGroup'
import { TextEditor } from 'client/generic/components/form/input/TextEditor'
import { MarkdownWithScript } from 'client/script/components/MarkdownWithCode'
import { CodeEditor } from 'client/script/components/CodeEditor'

type Model = Pick<ExerciseModel, 'title' | 'classifications' | 'description' | 'script'>

export function ExerciseFormDetails({ name, value, onChange }: UseModelProps<Model>): JSX.Element {
  const classifications = useLoadClassifications()
  const { bind } = useModel<Model>({ value, onChange, name })

  return (
    <FormCard className="card">
      <FormGroup label="Feledat neve">
        {(id) => <Input type="text" className="form-control" id={id} {...bind('title')} />}
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
                .sort(sortByProp('value')) || []
            }
            {...bind<string[]>('classifications')}
            itemRenderer={({ label, value }) => (
              <div>
                <span className="badge badge-info">{value.split('/')[1]}</span> {label}
              </div>
            )}
          />
        )}
      </div>
      <FormGroup label="Feledat leírása">
        {(id) => <TextEditor id={id} preview={MarkdownWithScript} {...bind('description')} />}
      </FormGroup>

      <FormGroup label="Script">{(id) => <CodeEditor id={id} {...bind('script')} />}</FormGroup>
    </FormCard>
  )
}
