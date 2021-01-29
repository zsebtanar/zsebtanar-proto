import { CLASSIFICATION_PARAM } from './values'
import { BadgeType } from '../../shared/generic/types'

export function toClassificationList(...classification: string[]): string {
  return `list?${CLASSIFICATION_PARAM}=${classification.join(',')}`
}

export function isGrade(classificationKey: string): boolean {
  return /^hu|grade/.test(classificationKey)
}

export function isSubject(classificationKey: string): boolean {
  return /^hu|(math|physics)/.test(classificationKey)
}

export function isFinalExam(classificationKey: string): boolean {
  return /^hu|final-exam/.test(classificationKey)
}

export function isTag(classificationKey: string): boolean {
  return /^hu|tag/.test(classificationKey)
}

export function classificationBadgeType(classificationKey: string): BadgeType {
  if (isGrade(classificationKey)) return 'primary'
  if (isSubject(classificationKey)) return 'secondary'
  if (isFinalExam(classificationKey)) return 'warning'

  return 'light'
}
