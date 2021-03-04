import {
  ExerciseSubTaskControlsType,
  UCBinaryChoice,
  UCFractionNumber,
  UCMultiChoice,
  UCNumberList,
  UCSimpleText,
  UCSingleChoice,
  UCSingleNumber,
  UCSolutions,
  UCUserAnswer,
  UserControl,
} from '../types'
import { binaryChoiceValidation } from './binaryChoice/binaryChoiceValidation'
import { fractionNumberValidation } from './fractionNumber/fractionNumberValidation'
import { multiChoiceValidation } from './multiChoice/multiChoiceValidator'
import { numberListValidation } from './numberList/numberListValidation'
import { simpleTextValidation } from './simpleText/simpleTextValidation'
import { singleChoiceValidation } from './singleChoice/singleChoiceValidation'
import { singleNumberValidation } from './singleNumber/singleNumberValidation'
import { FractionNumber } from '../../math/fractionNumber'

export function checkUserControl(
  ctrl: UserControl,
  solution: UCSolutions,
  userAnswer: UCUserAnswer,
): boolean {
  switch (ctrl.type) {
    case ExerciseSubTaskControlsType.BinaryChoice:
      return binaryChoiceValidation(
        ctrl,
        solution as UCBinaryChoice['solution'],
        userAnswer as boolean[],
      )
    case ExerciseSubTaskControlsType.FractionNumber:
      return fractionNumberValidation(
        ctrl,
        solution as UCFractionNumber['solution'],
        userAnswer as FractionNumber,
      )
    case ExerciseSubTaskControlsType.MultiChoice:
      return multiChoiceValidation(
        ctrl,
        solution as UCMultiChoice['solution'],
        userAnswer as boolean[],
      )
    case ExerciseSubTaskControlsType.NumberList:
      return numberListValidation(
        ctrl,
        solution as UCNumberList['solution'],
        userAnswer as string[],
      )
    case ExerciseSubTaskControlsType.SimpleText:
      return simpleTextValidation(ctrl, solution as UCSimpleText['solution'], userAnswer as string)
    case ExerciseSubTaskControlsType.SingleChoice:
      return singleChoiceValidation(
        ctrl,
        solution as UCSingleChoice['solution'],
        userAnswer as number,
      )
    case ExerciseSubTaskControlsType.SingleNumber:
      return singleNumberValidation(
        ctrl,
        solution as UCSingleNumber['solution'],
        userAnswer as string,
      )
    default:
      throw new Error(`Invalid user control type: "${ctrl['type']}"`)
  }
}
