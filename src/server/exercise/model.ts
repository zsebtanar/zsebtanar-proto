import * as z from 'zod'
import { ExerciseSubTaskControlsType } from 'shared/exercise/types'

const ExerciseStateEnum = z.enum(['draft', 'public', 'archived'])

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

export const ExerciseStateScheme = z.object({ state: ExerciseStateEnum })
export type ExerciseStateSchemeType = z.infer<typeof ExerciseStateScheme>
/*
message: "
	union option #0: type: single-number !== binary-choice
	name: Non-string type: undefined
	isDynamic: Non-boolean type: undefined
	props: Unexpected key(s) in object: 'fractionDigits'
	solution: Non-array type: string
		union option #1: type: single-number !== fraction-number
		name: Non-string type: undefined
		isDynamic: Non-boolean type: undefined
		props: Unexpected key(s) in object: 'fractionDigits'
		solution: Non-object type: string
			union option #2: type: single-number !== multi-choice
			name: Non-string type: undefined
			isDynamic: Non-boolean type: undefined
			props: Unexpected key(s) in object: 'fractionDigits'
			solution: Non-array type: string
				union option #3: type: single-number !== number-list
				name: Non-string type: undefined
				isDynamic: Non-boolean type: undefined
				props.acceptRandomOrder: Non-boolean type: undefined
				props.multiLine: Non-boolean type: undefined
				props.fields: Non-array type: undefined
				solution: Non-array type: string
					union option #4: type: single-number !== simple-text
					name: Non-string type: undefined
					isDynamic: Non-boolean type: undefined
					props: Unexpected key(s) in object: 'fractionDigits'
					solution: Non-array type: string
						union option #5: type: single-number !== single-choice
						name: Non-string type: undefined
						isDynamic: Non-boolean type: undefined
						props: Unexpected key(s) in object: 'fractionDigits'
						solution: Non-number type: string
							union option #6: name: Non-string type: undefined"

* */
