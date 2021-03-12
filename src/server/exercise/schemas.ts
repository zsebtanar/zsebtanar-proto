import S from 'fluent-json-schema'
import { ExerciseSubTaskControlsType } from '../../shared/exercise/types'

const ExerciseStateEnum = S.enum(['new', 'draft', 'public', 'archived', 'remove'])
const binaryChoiceSolutionSchema = S.array().items(S.boolean())
const binaryChoiceSchema = S.object()
  .id('#binaryChoise')
  .prop('type', S.const(ExerciseSubTaskControlsType.BinaryChoice))
  .prop('name', S.string())
  .prop('isDynamic', S.boolean())
  .prop(
    'props',
    S.object()
      .prop('randomOrder', S.boolean())
      .prop(
        'options',
        S.array().items(
          S.object()
            .prop('statement', S.string())
            .prop('trueLabel', S.string())
            .prop('falseLabel', S.string()),
        ),
      ),
  )
  .prop('solution', binaryChoiceSolutionSchema)
  .required(['type', 'solution'])

const fractionNumber = S.object().prop('numerator', S.number()).prop('denominator', S.number())

const fractionNumberSchema = S.object()
  .id('#fractionNumber')
  .prop('type', S.const(ExerciseSubTaskControlsType.FractionNumber))
  .prop('name', S.string())
  .prop('isDynamic', S.boolean())
  .prop('props', S.object().prop('prefix', S.string()).prop('postfix', S.string()))
  .prop('solution', fractionNumber)
  .required(['type', 'solution'])

  .prop('numerator', S.number())
  .prop('denominator', S.number())
const multiChoiceSolutionSchema = S.array().items(S.boolean())
const multiChoiceSchema = S.object()
  .id('#multiChoice')
  .prop('type', S.const(ExerciseSubTaskControlsType.MultiChoice))
  .prop('name', S.string())
  .prop('isDynamic', S.boolean())
  .prop(
    'props',
    S.object()
      .prop('randomOrder', S.boolean())
      .prop('options', S.array().items(S.object().prop('label', S.string()))),
  )
  .prop('solution', multiChoiceSolutionSchema)
  .required(['type', 'solution'])

const numberListSolutionSchema = S.array().items(S.number())
const numberListSchema = S.object()
  .id('#numberList')
  .prop('type', S.const(ExerciseSubTaskControlsType.NumberList))
  .prop('name', S.string())
  .prop('isDynamic', S.boolean())
  .prop(
    'props',
    S.object()
      .prop('prefix', S.string())
      .prop('postfix', S.string())
      .prop('fractionDigits', S.number())
      .prop('acceptRandomOrder', S.boolean())
      .prop('multiLine', S.boolean())
      .prop(
        'fields',
        S.array().items(S.object().prop('prefix', S.string()).prop('postfix', S.string())),
      ),
  )
  .prop('solution', numberListSolutionSchema)
  .required(['type', 'solution'])

const simpleTextSolutionSchema = S.array().items(S.string())
const simpleTextSchema = S.object()
  .id('#simpleText')
  .prop('type', S.const(ExerciseSubTaskControlsType.SimpleText))
  .prop('name', S.string())
  .prop('isDynamic', S.boolean())
  .prop(
    'props',
    S.object()
      .prop('prefix', S.string())
      .prop('postfix', S.string())
      .prop('ignoreSpaces', S.boolean())
      .prop('caseSensitive', S.boolean()),
  )
  .prop('solution', simpleTextSolutionSchema)
  .required(['type', 'solution'])

const singleChoiceSolutionSchema = S.number()
const singleChoiceSchema = S.object()
  .id('#singleChoice')
  .prop('type', S.const(ExerciseSubTaskControlsType.SingleChoice))
  .prop('name', S.string())
  .prop('isDynamic', S.boolean())
  .prop('props', S.object().prop('options', S.array().items(S.object().prop('label', S.string()))))
  .prop('solution', singleChoiceSolutionSchema)
  .required(['type', 'solution'])

const singleNumberSolutionSchema = S.number()
const singleNumberSchema = S.object()
  .id('#singleNumber')
  .prop('type', S.const(ExerciseSubTaskControlsType.SingleNumber))
  .prop('name', S.string())
  .prop('isDynamic', S.boolean())
  .prop(
    'props',
    S.object()
      .prop('prefix', S.string())
      .prop('postfix', S.string())
      .prop('fractionDigits', S.number()),
  )
  .prop('solution', singleNumberSolutionSchema)
  .required(['type', 'solution'])

///

export const exerciseSchema = S.object()
  .title('Create exercise body')
  .prop('title', S.string())
  .prop('lang', S.string().minLength(2).maxLength(2))
  .prop('state', ExerciseStateEnum)
  .prop('classifications', S.array().items(S.string()))
  .prop('description', S.string())
  .prop('difficulty', S.number())
  .prop('script', S.string())
  .prop(
    'subTasks',
    S.array().items(
      S.object()
        .prop('title', S.string())
        .prop('description', S.string())
        .prop('hints', S.array().items(S.string()))
        .prop(
          'controls',
          S.array().items(
            S.anyOf([
              binaryChoiceSchema,
              fractionNumberSchema,
              multiChoiceSchema,
              numberListSchema,
              simpleTextSchema,
              singleChoiceSchema,
              singleNumberSchema,
            ]),
          ),
        ),
    ),
  )
  .required(['title', 'state'])
  .additionalProperties(false)
  .valueOf()

export const changeExerciseStateSchema = S.object().prop('state', ExerciseStateEnum).valueOf()

export const exerciseCheckSchema = S.object()
  .prop('subTask', S.number().minimum(0).maximum(1_000))
  .prop('seed', S.number().minimum(1).maximum(1_000_000))
  .prop(
    'answers',
    S.array().items(
      S.anyOf([
        S.string(),
        S.number(),
        fractionNumber,
        S.array().items(S.anyOf([S.boolean(), S.string()])),
      ]),
    ),
  )
  .required()
  .valueOf()

export const exerciseNextHintSchema = S.object()
  .prop('subTask', S.number().minimum(0).maximum(1_000))
  .prop('hint', S.string())
  .required()
  .valueOf()
