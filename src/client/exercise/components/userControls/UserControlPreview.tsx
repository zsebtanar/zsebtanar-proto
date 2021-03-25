/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import { UserControl } from 'shared/exercise/types'

import * as t from './controlTypes'
import { SimpleText } from './simpleText/SimpleText'
import { SingleNumber } from './singleNumber/SingleNumber'
import { FractionNumberComponent } from './fractionNumber/FractionNumberComponent'
import { NumberList } from './numberList/NumberList'
import { SingleChoice } from './singleChoice/SingleChoice'
import { BinaryChoice } from './binaryChoice/BinaryChoice'
import { MultiChoice } from './multiChoice/MultiChoice'
import { getSolution, resolveDynamicUserControllerProps } from 'shared/exercise/userControls/utils'
import { usePocketLisp } from '../../../script/providers/PocketLispProvider'
import { Alert } from '../../../generic/components/Alert'

interface Props<TSolution> {
  ctrl: UserControl
  children?: React.ReactNode
}

export function UserControlsPreview<TSolution>({ ctrl, children }: Props<TSolution>): JSX.Element {
  const { evalPL } = usePocketLisp()

  const props = {
    disabled: true,
    readonly: false,
    ctrl,
    value: ctrl.solution,
  }

  if (ctrl.isDynamic && !ctrl.name) {
    return <Alert type="warning">Adj nevet a megoldási mezőnek!</Alert>
  }

  if (ctrl.isDynamic) {
    try {
      props.ctrl = resolveDynamicUserControllerProps(ctrl, evalPL)
      props.value = getSolution(props.ctrl, evalPL)
    } catch (e) {
      /*noop*/
    }

    if (!props.value) {
      return <React.Fragment>{children}</React.Fragment>
    }
  }

  switch (ctrl.type) {
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
