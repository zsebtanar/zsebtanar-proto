import * as React from 'react'
import { UserControl } from 'shared/exercise/types'
import { UseModelProps } from 'client/generic/hooks/model'

import * as t from './controlTypes'
import { SimpleTextAdmin } from './simpleText/SimpleTextAdmin'
import { SingleChoiceAdmin } from './singleChoice/SingleChoiceAdmin'
import { SingleNumberAdmin } from './singleNumber/SingleNumberAdmin'
import { BinaryChoiceAdmin } from './binaryChoice/BinaryChoiceAdmin'
import { MultiChoiceAdmin } from './multiChoice/MultiChoiceAdmin'
import { FractionNumberAdmin } from './fractionNumber/FractionNumberAdmin'
import { NumberListAdmin } from './numberList/NumberListAdmin'

export function UserControlsAdmin({ ...bindProps }: UseModelProps<UserControl>): JSX.Element {
  switch (bindProps.value.type) {
    case t.SIMPLE_TEXT:
      return <SimpleTextAdmin {...(bindProps as any)} />
    case t.SINGLE_NUMBER:
      return <SingleNumberAdmin {...(bindProps as any)} />
    case t.FRACTION_NUMBER:
      return <FractionNumberAdmin {...(bindProps as any)} />
    case t.NUMBER_LIST:
      return <NumberListAdmin {...(bindProps as any)} />
    case t.SINGLE_CHOICE:
      return <SingleChoiceAdmin {...(bindProps as any)} />
    case t.BINARY_CHOICE:
      return <BinaryChoiceAdmin {...(bindProps as any)} />
    case t.MULTI_CHOICE:
      return <MultiChoiceAdmin {...(bindProps as any)} />
    default:
      return (
        <div className="alert alert-danger">
          Not implemented Admin control type {bindProps.value.type}
        </div>
      )
  }
}
