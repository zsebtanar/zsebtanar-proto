import * as React from 'react'
import { range } from 'ramda'
import { Icon } from 'client/generic/components/Icon'

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
      <a className={`page-link ${active ? 'active' : ''}`} href="#" onClick={() => onClick(page)}>
        {page}
        {active && <span className="sr-only">(aktuális)</span>}
      </a>
    </li>
  )
}

function StepBtn(text, icon, onClick, disabled) {
  return (
    <li className={`page-item ${disabled ? 'disabled' : ''}`}>
      <a
        className="page-link"
        href="#"
        aria-label="Next"
        tabIndex={disabled ? -1 : 0}
        onClick={onClick}
      >
        <span aria-hidden="true"><Icon fa={icon}/></span>
        <span className="sr-only">{text}</span>
      </a>
    </li>
  )
}
