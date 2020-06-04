import { ObjectMap, BaseModel } from '../generic/types'
import { FractionNumber } from '../math/fractionNumber'

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
  lastUpdate: Date
}

export enum ExerciseState {
  Draft = 'draft',
  Public = 'public',
  Archived = 'archived',
  Remove = 'remove'
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
  SingleNumber = 'single-number'
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
  props: {
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
  props: {
    prefix?: string
    postfix?: string
  }
  solution: FractionNumber
}

export interface UCMultiChoice extends BaseUserControl {
  type: ExerciseSubTaskControlsType.MultiChoice
  props: {
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

export interface UCNumberListField {
  prefix?: string
  postfix?: string
}

export interface UCSimpleText extends BaseUserControl {
  type: ExerciseSubTaskControlsType.SimpleText
  props: {
    prefix?: string
    postfix?: string
    ignoreSpaces: boolean
    caseSensitive: boolean
  }
  solution: string[]
}

export interface UCSingleChoice extends BaseUserControl {
  type: ExerciseSubTaskControlsType.SingleChoice
  props: {
    options: UCSingleChoiceOption[]
  }
  solution: number
}

export interface UCSingleChoiceOption {
  label: string
}

export interface UCSingleNumber extends BaseUserControl {
  type: ExerciseSubTaskControlsType.SingleNumber
  props: {
    prefix?: string
    postfix?: string
    fractionDigits: number
  }
  solution: string
}
