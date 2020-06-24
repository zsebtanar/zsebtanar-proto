import * as React from 'react'
import { UserControl } from 'shared/exercise/types'
import { UseModelProps } from 'client/generic/hooks/model'

import * as t from './controlTypes'
import { SimpleText } from './simpleText/simpleTextValidation'
import { SingleNumber } from './singleNumber/SingleNumber'
import { FractionNumberComponent } from './fractionNumber/FractionNumberComponent'
import { NumberList } from './numberList/NumberList'
import { SingleChoice } from './singleChoice/singleChoiceValidation'
import { BinaryChoice } from './binaryChoice/BinaryChoice'
import { MultiChoice } from './multiChoice/MultiChoice'

interface Props<TSolution> extends UseModelProps<TSolution> {
  ctrl: UserControl
  readonly?: boolean
  disabled?: boolean
}

export function UserControls<TSolution>({ ...props }: Props<TSolution>) {
  switch (props.ctrl.type) {
    case t.SIMPLE_TEXT:
      return <SimpleText {...(props as any)} />
    case t.SINGLE_NUMBER:
      return <SingleNumber {...(props as any)} />
    case t.FRACTION_NUMBER:
      return <FractionNumberComponent {...(props as any)} />
    case t.NUMBER_LIST:
      return <NumberList {...(props as any)} />
    case t.SINGLE_CHOICE:
      return <SingleChoice {...(props as any)} />
    case t.BINARY_CHOICE:
      return <BinaryChoice {...(props as any)} />
    case t.MULTI_CHOICE:
      return <MultiChoice {...(props as any)} />
    default:
      return (
        <div className="alert alert-danger">Not implemented control type {props.ctrl.type}</div>
      )
  }
}
