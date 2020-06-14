import * as z from 'zod'
import { ExerciseSubTaskControlsType } from 'shared/exercise/types'

const ExerciseStateEnum = z.enum(['draft', 'public', 'archived'])

export const ExerciseSchema = z.object({
  title: z.string(),
  state: ExerciseStateEnum,
  classifications: z.array(z.string()),
  difficulty: z.number(),
  description: z.string(),
  script: z.string(),
  subTasks: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      hints: z.array(z.string()),
      controls: z.array(
        z.union([
          z.object({
            type: z.literal(ExerciseSubTaskControlsType.BinaryChoice),
            name: z.string(),
            isDynamic: z.boolean(),
            props: z.object({
              randomOrder: z.boolean(),
              options: z.array(
                z.object({
                  statement: z.string(),
                  trueLabel: z.string(),
                  falseLabel: z.string()
                })
              )
            }),
            solution: z.array(z.boolean())
          }),
          z.object({
            type: z.literal(ExerciseSubTaskControlsType.FractionNumber),
            name: z.string(),
            isDynamic: z.boolean(),
            props: z.object({
              prefix: z.string().optional(),
              postfix: z.string().optional()
            }),
            solution: z.object({
              numerator: z.number(),
              denominator: z.number()
            })
          }),
          z.object({
            type: z.literal(ExerciseSubTaskControlsType.MultiChoice),
            name: z.string(),
            isDynamic: z.boolean(),
            props: z.object({
              randomOrder: z.boolean(),
              options: z.array(
                z.object({
                  label: z.string()
                })
              )
            }),
            solution: z.array(z.boolean())
          }),
          z.object({
            type: z.literal(ExerciseSubTaskControlsType.NumberList),
            name: z.string(),
            isDynamic: z.boolean(),
            props: z.object({
              prefix: z.string().optional(),
              postfix: z.string().optional(),
              fractionDigits: z.number(),
              acceptRandomOrder: z.boolean(),
              multiLine: z.boolean(),
              fields: z.array(
                z.object({
                  prefix: z.string().optional(),
                  postfix: z.string().optional()
                })
              )
            }),
            solution: z.array(z.string())
          }),
          z.object({
            type: z.literal(ExerciseSubTaskControlsType.SimpleText),
            name: z.string(),
            isDynamic: z.boolean(),
            props: z.object({
              prefix: z.string().optional(),
              postfix: z.string().optional(),
              ignoreSpaces: z.boolean(),
              caseSensitive: z.boolean()
            }),
            solution: z.array(z.string())
          }),
          z.object({
            type: z.literal(ExerciseSubTaskControlsType.SingleChoice),
            name: z.string(),
            isDynamic: z.boolean(),
            props: z.object({
              options: z.array(z.object({ label: z.string() }))
            }),
            solution: z.number()
          }),
          z.object({
            type: z.literal(ExerciseSubTaskControlsType.SingleNumber),
            name: z.string(),
            isDynamic: z.boolean(),
            props: z.object({
              prefix: z.string().optional(),
              postfix: z.string().optional(),
              fractionDigits: z.number()
            }),
            solution: z.string()
          })
        ])
      )
    })
  )
})

export type ExerciseSchemaType = z.infer<typeof ExerciseSchema>

export const ExerciseStateScheme = z.object({ state: ExerciseStateEnum })
export type ExerciseStateSchemeType = z.infer<typeof ExerciseStateScheme>
