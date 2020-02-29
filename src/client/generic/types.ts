
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

export interface FormField<T = string> {
  name: string
  defaultValue?: T
  placeholder?: string
  helpText?: string
  representation: Representation
}

export interface FieldOnChangeEvent<T> {
  name: string
  value: T
}

export interface FieldOnChange<T> {
  (event: FieldOnChangeEvent<T>): void
}
