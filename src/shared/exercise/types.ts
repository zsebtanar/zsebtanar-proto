import { BaseModel } from '../generic/types'
import { FractionNumber } from '../math/fractionNumber'

/**
 * Used in public app for exercise lists
 */
export interface ExerciseSummaryModel extends BaseModel, ExerciseSummaryDoc {}

export interface ExerciseSummaryDoc {
  title: string
  published?: Date
  classifications: string[]
  difficulty: number
  description: string
}

/**
 * Used in public app when user soling an exercise
 */
export interface ExerciseDetailsModel extends ExerciseSummaryModel {
  title: string
  description: string
  controls: Array<Omit<UserControl, 'solution'>>
}

export interface ExercisePublicSubTask {
  subTasks: ExerciseDetailsModel[]
}

export interface ExerciseModel extends BaseModel, ExerciseDoc {}

/**
 * Used in admin app only
 */
export interface ExerciseDoc {
  title: string
  state: ExerciseState
  created: Date
  createdBy: string
  updated: Date
  updatedBy: string
  published?: Date
  classifications: string[]
  difficulty: number
  description: string
  script: string
  subTasks: ExerciseSubTask[]
}

export enum ExerciseState {
  New = 'new',
  Clone = 'clone',
  Draft = 'draft',
  Public = 'public',
  Archived = 'archived',
  Remove = 'remove',
}

export interface ExerciseSubTask {
  title: string
  description: string
  controls: UserControl[]
  hints: ExerciseSubTaskHints
}

export type ExerciseSubTaskHints = string[]

export enum ExerciseSubTaskControlsType {
  BinaryChoice = 'binary-choice',
  FractionNumber = 'fraction-number',
  MultiChoice = 'multi-choice',
  NumberList = 'number-list',
  SimpleText = 'simple-text',
  SingleChoice = 'single-choice',
  SingleNumber = 'single-number',
}

export type UserControl =
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

export interface UCBinaryChoice extends BaseUserControl {
  type: ExerciseSubTaskControlsType.BinaryChoice
  props?: {
    randomOrder: boolean
    options: UCBinaryChoiceOption[]
  }
  solution: boolean[]
}

export interface UCBinaryChoiceOption {
  statement: string
  trueLabel: string
  falseLabel: string
}

export interface UCFractionNumber extends BaseUserControl {
  type: ExerciseSubTaskControlsType.FractionNumber
  props?: {
    prefix?: string
    postfix?: string
  }
  solution: FractionNumber
}

export interface UCMultiChoice extends BaseUserControl {
  type: ExerciseSubTaskControlsType.MultiChoice
  props?: {
    randomOrder: boolean
    options: UCMultiChoiceOption[]
  }
  solution: boolean[]
}
export interface UCMultiChoiceOption {
  label: string
}

export interface UCNumberList extends BaseUserControl {
  type: ExerciseSubTaskControlsType.NumberList
  props?: {
    prefix?: string
    postfix?: string
    fractionDigits: number
    acceptRandomOrder: boolean
    multiLine: boolean
    fields: UCNumberListField[]
  }
  solution: string[]
}

export interface UCNumberListField {
  prefix?: string
  postfix?: string
}

export interface UCSimpleText extends BaseUserControl {
  type: ExerciseSubTaskControlsType.SimpleText
  props?: {
    prefix?: string
    postfix?: string
    ignoreSpaces: boolean
    caseSensitive: boolean
  }
  solution: string[]
}

export interface UCSingleChoice extends BaseUserControl {
  type: ExerciseSubTaskControlsType.SingleChoice
  props?: {
    options: UCSingleChoiceOption[]
  }
  solution: number
}

export interface UCSingleChoiceOption {
  label: string
}

export interface UCSingleNumber extends BaseUserControl {
  type: ExerciseSubTaskControlsType.SingleNumber
  props?: {
    prefix?: string
    postfix?: string
    fractionDigits: number
  }
  solution: string
}
