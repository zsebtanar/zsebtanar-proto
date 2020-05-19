export enum RepresentationType {
  Text,
  Number,
  MultilineText,
  Markdown,
  Date,
  Time,
  DateTime,
  Checkbox,
  RadioButton,
  Select
}

export interface BaseField {
  type: RepresentationType
  readonly?: boolean
}

export interface TextField extends BaseField {
  type: RepresentationType.Text
  maxLength?: number
}

export interface NumberField extends BaseField {
  type: RepresentationType.Number
  min?: number
  max?: number
  step?: number
}

export interface MultilineTextField extends BaseField {
  type: RepresentationType.MultilineText
}
export interface MarkdownField extends BaseField {
  type: RepresentationType.Markdown
}
export interface DateField extends BaseField {
  type: RepresentationType.Date
}
export interface TimeField extends BaseField {
  type: RepresentationType.Time
}
export interface DateTimeField extends BaseField {
  type: RepresentationType.DateTime
}
export interface CheckboxField extends BaseField {
  type: RepresentationType.Checkbox
}
export interface RadioButtonField extends BaseField {
  type: RepresentationType.RadioButton
}
export interface SelectField extends BaseField {
  type: RepresentationType.Select
}

export type Representation =
  | TextField
  | NumberField
  | MultilineTextField
  | MarkdownField
  | DateField
  | TimeField
  | DateTimeField
  | CheckboxField
  | RadioButtonField
  | SelectField

interface FormFieldTemplateOptions {}

export interface FieldDefinition<T = string> {
  name: string
  templateOptions: FormFieldTemplateOptions
  defaultValue?: T
  placeholder?: string
  helpText?: string
  representation: Representation
}

export type FieldDefinitionList<TModel> = FieldDefinition<keyof TModel>[]

export interface FieldOnChangeEvent<T> {
  name: string
  value: T
}

export type FieldOnChange<TValue> = (value: TValue) => void

export interface FieldModelProps<TValue, TTemplate> {
  name: string
  value: TValue
  onChange: (name: string, newValue: TValue) => void
  templateOptions: TTemplate
}

export interface ObjectMap<T> {
  [key: string]: T
}
