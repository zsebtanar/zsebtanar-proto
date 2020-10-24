import * as z from 'zod'
import { ExerciseSubTaskControlsType } from 'shared/exercise/types'

const ExerciseStateEnum = z.enum(['new', 'draft', 'public', 'archived', 'remove'])

const binaryChoiceSchema = z.object({
  type: z.literal(ExerciseSubTaskControlsType.BinaryChoice),
  name: z.string().optional(),
  isDynamic: z.boolean().optional(),
  props: z.object({
    randomOrder: z.boolean(),
    options: z.array(
      z.object({
        statement: z.string(),
        trueLabel: z.string(),
        falseLabel: z.string(),
      }),
    ),
  }),
  solution: z.array(z.boolean()),
})

const fractionNumberSchema = z.object({
  type: z.literal(ExerciseSubTaskControlsType.FractionNumber),
  name: z.string().optional(),
  isDynamic: z.boolean().optional(),
  props: z.object({
    prefix: z.string().optional(),
    postfix: z.string().optional(),
  }),
  solution: z.object({
    numerator: z.number(),
    denominator: z.number(),
  }),
})

const multiChoiceSchema = z.object({
  type: z.literal(ExerciseSubTaskControlsType.MultiChoice),
  name: z.string().optional(),
  isDynamic: z.boolean().optional(),
  props: z.object({
    randomOrder: z.boolean(),
    options: z.array(
      z.object({
        label: z.string(),
      }),
    ),
  }),
  solution: z.array(z.boolean()),
})

const numberListSchema = z.object({
  type: z.literal(ExerciseSubTaskControlsType.NumberList),
  name: z.string().optional(),
  isDynamic: z.boolean().optional(),
  props: z.object({
    prefix: z.string().optional(),
    postfix: z.string().optional(),
    fractionDigits: z.number(),
    acceptRandomOrder: z.boolean(),
    multiLine: z.boolean(),
    fields: z.array(
      z.object({
        prefix: z.string().optional(),
        postfix: z.string().optional(),
      }),
    ),
  }),
  solution: z.array(z.string()),
})

const simpleTextSchema = z.object({
  type: z.literal(ExerciseSubTaskControlsType.SimpleText),
  name: z.string().optional(),
  isDynamic: z.boolean().optional(),
  props: z.object({
    prefix: z.string().optional(),
    postfix: z.string().optional(),
    ignoreSpaces: z.boolean(),
    caseSensitive: z.boolean(),
  }),
  solution: z.array(z.string()),
})

const singleChoiceSchema = z.object({
  type: z.literal(ExerciseSubTaskControlsType.SingleChoice),
  name: z.string().optional(),
  isDynamic: z.boolean().optional(),
  props: z.object({
    options: z.array(z.object({ label: z.string() })),
  }),
  solution: z.number(),
})

const singleNumberSchema = z.object({
  type: z.literal(ExerciseSubTaskControlsType.SingleNumber),
  name: z.string().optional(),
  isDynamic: z.boolean().optional(),
  props: z.object({
    prefix: z.string().optional(),
    postfix: z.string().optional(),
    fractionDigits: z.number(),
  }),
  solution: z.string().optional(),
})

export const ExerciseSchema = z.object({
  title: z.string(),
  created: z.any(),
  state: ExerciseStateEnum,
  classifications: z.array(z.string()),
  difficulty: z.number(),
  description: z.string(),
  script: z.string(),
  subTasks: z.array(
    z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      hints: z.array(z.string()).optional(),
      controls: z.array(
        z.union([
          binaryChoiceSchema,
          fractionNumberSchema,
          multiChoiceSchema,
          numberListSchema,
          simpleTextSchema,
          singleChoiceSchema,
          singleNumberSchema,
        ]),
      ),
    }),
  ),
})

export type ExerciseSchemaType = z.infer<typeof ExerciseSchema>

export const ExerciseStateScheme = z.object({ state: ExerciseStateEnum, created: z.date() })
export type ExerciseStateSchemeType = z.infer<typeof ExerciseStateScheme>
