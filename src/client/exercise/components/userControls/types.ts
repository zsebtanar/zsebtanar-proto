import { UserControl } from 'shared/exercise/types'

export type Interpreter<T = unknown> = (source: string) => T

export type ValidatorFn = (
  control: UserControl,
  userInput: UserControl['solution'],
  solution: UserControl['solution'],
) => boolean
