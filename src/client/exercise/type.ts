import { BaseModel } from '../generic/services'
import { ObjectMap } from '../generic/types'

export interface ExerciseModel extends BaseModel {
  title: string
  state: ExerciseState
  metadata?: ExerciseMetadata
  classifications: string[]
  difficulty: number
  description: string
  script: string
  resources: ObjectMap<ExerciseAsset>
  subTasks: ExerciseSubTask[]
}

enum ExerciseState {
  Draft = 'draft',
  Active = 'active',
  Archived = 'archived'
}

interface ExerciseMetadata {
  created: Date
  createdBy: string
  updated: Date
  updatedBy: string
  resources: ObjectMap<ExerciseAsset>
}

interface ExerciseAssetPublic {
  type: string
  url: string
}

interface ExerciseAsset extends ExerciseAssetPublic {
  fullPath: string
  name: string
}

interface ExerciseSubTask {
  title: string
  description: string
  controls: UserControl[]
  hints: string[]
}

enum ExerciseSubTaskControlsType {
  BinaryChoice = 'binary-choice',
  FractionNumber = 'fraction-number',
  MultiChoice = 'multi-choice',
  NumberList = 'number-list',
  SimpleText = 'simple-text',
  SingleChoice = 'single-choice',
  SingleNumber = 'single-number'
}

type UserControl =
  | UCBinaryChoice
  | UCFractionNumber
  | UCMultiChoice
  | UCNumberList
  | UCSimpleText
  | UCSingleChoice
  | UCSingleNumber

interface BaseUserControl {
  type: ExerciseSubTaskControlsType
  name: string
  isDynamic: boolean
}

interface UCBinaryChoice extends BaseUserControl {
  type: ExerciseSubTaskControlsType.BinaryChoice
  props: {
    randomOrder: boolean
    options: UCBinaryChoiceOption[]
  }
  solution: boolean[]
}

interface UCBinaryChoiceOption {
  label: string
  trueLabel: string
  falseLabel: string
}

interface UCFractionNumber extends BaseUserControl {
  type: ExerciseSubTaskControlsType.FractionNumber
  props: {
    prefix?: string
    postfix?: string
  }
  solution: FractionNumber
}

interface FractionNumber {
  numerator: number
  denominator: number
}

interface UCMultiChoice extends BaseUserControl {
  type: ExerciseSubTaskControlsType.MultiChoice
  props: {
    randomOrder: boolean
    options: string[]
  }
  solution: boolean[]
}

interface UCNumberList extends BaseUserControl {
  type: ExerciseSubTaskControlsType.NumberList
  props: {
    prefix?: string
    postfix?: string
    fractionDigits: number
    acceptRandomOrder: boolean
    multiLine: boolean
    fields: UCNumberListField[]
  }
  solution: string[]
}

interface UCNumberListField {
  prefix?: string
  postfix?: string
}

interface UCSimpleText extends BaseUserControl {
  type: ExerciseSubTaskControlsType.SimpleText
  props: {
    prefix?: string
    postfix?: string
    ignoreSpaces?: boolean
    caseSensitive?: boolean
  }
  solution: string[]
}

interface UCSingleChoice extends BaseUserControl {
  type: ExerciseSubTaskControlsType.SingleChoice
  props: {
    options: UCSingleChoiceOption[]
  }
  solution: string
}

interface UCSingleChoiceOption {
  label: string
}

interface UCSingleNumber extends BaseUserControl {
  type: ExerciseSubTaskControlsType.SingleNumber
  props: {
    prefix?: string
    postfix?: string
    fractionDigits: number
  }
  solution: number
}
