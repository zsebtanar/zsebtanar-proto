import React from 'react'
import { Icon } from 'client/generic/components/Icon'
import { range } from 'shared/utils/fn'
import { Button } from '..'

interface Props {
  next: () => void
  prev: () => void
  jump: (page: number) => void
  current: number
  length: number
}

export function GridPagination({ prev, next, jump, current, length }: Props) {
  if (length <= 1) return null

  const pages = range(1, length + 1)
  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination justify-content-center">
        {StepBtn('Előző', 'chevron-left', prev, current !== 1)}
        {pages.map(page => jumpBtn(page, jump, current === page))}
        {StepBtn('Következő', 'chevron-right', next, current !== length)}
      </ul>
    </nav>
  )
}

function jumpBtn(page, onClick, active) {
  return (
    <li className="page-item" key={page}>
      <Button className={`page-link ${active ? 'active' : ''}`} onAction={() => onClick(page)}>
        {page}
        {active && <span className="sr-only">(aktuális)</span>}
      </Button>
    </li>
  )
}

function StepBtn(text, icon, onClick, disabled) {
  return (
    <li className={`page-item ${disabled ? 'disabled' : ''}`}>
      <Button
        className="page-link"
        aria-label="Next"
        tabIndex={disabled ? -1 : 0}
        onAction={onClick}
      >
        <span aria-hidden="true">
          <Icon fa={icon} />
        </span>
        <span className="sr-only">{text}</span>
      </Button>
    </li>
  )
}
