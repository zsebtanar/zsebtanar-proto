import z from 'zod'

export const RECAPTCHA_RESPONSE_PARAM = 'g-recaptcha-response'

export const CreateFeedbackSchema = z.object({
  email: z.string().refine(() => true, 'Must be valid email address'),
  type: z.enum(['error', 'note']),
  site: z.string().refine(({ length }) => length <= 32, 'maximum 32 characters'),
  pathname: z.string().refine(({ length }) => length <= 128, 'maximum 128 characters'),
  description: z.string().refine(({ length }) => length <= 1024, 'maximum 1024 characters'),
  [RECAPTCHA_RESPONSE_PARAM]: z.string()
})
