import React from 'react'
import { range } from 'shared/utils/fn'
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'react-feather'

import { Button } from '../Button'
import { Icon } from '../icons/Icon'

interface Props {
  next: () => void
  prev: () => void
  jump: (page: number) => void
  current: number
  length: number
  noPageButtons?: boolean
}

export function GridPagination({
  prev,
  next,
  jump,
  current,
  length,
  noPageButtons,
}: Props): JSX.Element | null {
  if (length <= 1) return null

  return (
    <nav aria-label="Lapozás" className="d-flex justify-content-center">
      <div className="btn-group">
        {StepBtn('Előző', ChevronLeftIcon, prev, current === 0)}
        {!noPageButtons && range(0, length).map((page) => jumpBtn(page, jump, current === page))}
        {StepBtn('Következő', ChevronRightIcon, next, current === length - 1)}
      </div>
    </nav>
  )
}

function jumpBtn(page, onClick, active) {
  return (
    <Button
      btn="light"
      className={` ${active ? 'active' : ''}`}
      onAction={() => onClick(page)}
      key={page}
    >
      {page + 1}
      {active && <span className="sr-only">(aktuális)</span>}
    </Button>
  )
}

function StepBtn(text, Icon, onClick, disabled) {
  return (
    <Button
      btn="light"
      className="page-link"
      aria-label="Next"
      tabIndex={disabled ? -1 : 0}
      onAction={onClick}
      disabled={disabled}
    >
      <span aria-hidden="true">
        <Icon icon={Icon} />
      </span>
      <span className="sr-only">{text}</span>
    </Button>
  )
}
