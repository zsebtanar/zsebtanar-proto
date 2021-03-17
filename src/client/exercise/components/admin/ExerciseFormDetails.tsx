import React from 'react'
import { ExerciseModel } from 'shared/exercise/types'
import { useModel, UseModelProps } from 'client/generic/hooks/model'
import { FormCard } from 'client/generic/components/form/FormCard'
import { Input } from 'client/generic/components/form/input/Input'
import { FormGroup } from 'client/generic/components/form/FormGroup'
import { TextEditor } from 'client/generic/components/form/input/TextEditor'
import { MarkdownWithScript } from 'client/script/components/MarkdownWithCode'
import { CodeEditor } from 'client/script/components/CodeEditor'
import { ClassificationComboBox } from '../../../classification/components/ClassificationComboBox'
import { Select } from '../../../generic/components/form/input/Select'

type Model = Pick<ExerciseModel, 'title' | 'classifications' | 'description' | 'script'>

const LANG_OPTIONS = [{ label: 'Magyar', value: 'hu' }]

export function ExerciseFormDetails({ name, value, onChange }: UseModelProps<Model>): JSX.Element {
  const { bind } = useModel<Model>({ value, onChange, name })

  return (
    <FormCard className="card exercise-details">
      <FormGroup label="Feladat neve">
        {(id) => <Input type="text" className="form-control" id={id} {...bind('title')} />}
      </FormGroup>

      <div className="form-group">
        <ClassificationComboBox {...bind<string[]>('classifications')} />
      </div>

      <FormGroup label="Nyelv">
        {() => (
          <Select
            {...bind<string>('lang')}
            className="form-control"
            options={LANG_OPTIONS}
            required
          />
        )}
      </FormGroup>

      <FormGroup label="Feladat leírása">
        {(id) => <TextEditor id={id} preview={MarkdownWithScript} {...bind('description')} />}
      </FormGroup>

      <FormGroup label="Script">{(id) => <CodeEditor id={id} {...bind('script')} />}</FormGroup>
    </FormCard>
  )
}
