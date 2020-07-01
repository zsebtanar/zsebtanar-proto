import React from 'react'
import { range } from 'shared/utils/fn'
import { Button } from '..'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

interface Props {
  next: () => void
  prev: () => void
  jump: (page: number) => void
  current: number
  length: number
}

export function GridPagination({ prev, next, jump, current, length }: Props) {
  if (length <= 1) return null

  const pages = range(0, length)
  return (
    <nav aria-label="Lapozás" className="d-flex justify-content-center">
      <div className="btn-group">
        {StepBtn('Előző', faChevronLeft, prev, current === 0)}
        {pages.map(page => jumpBtn(page, jump, current === page))}
        {StepBtn('Következő', faChevronRight, next, current === length - 1)}
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

function StepBtn(text, icon, onClick, disabled) {
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
        <FontAwesomeIcon icon={icon} />
      </span>
      <span className="sr-only">{text}</span>
    </Button>
  )
}
