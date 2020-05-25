import z from 'zod'

export const roleUpdateSchema = z.object({
  newRole: z
    .number()
    .refine(num => Number.isInteger(num) && num >= 0, 'Role must a positive integer or zero')
})

export const profileUpdateSchema = z.object({
  displayName: z
    .string()
    .refine(
      ({ length }) => length > 3 && length < 64,
      'Display name must be more then 3 and less then 64 characters'
    ),
  photoURL: z.string().refine(isValidUrl, 'PhotoUrl must be valid URL')
})
