import React, { useState, useRef } from 'react'
import { useCombobox, useMultipleSelection } from 'downshift'
import * as cx from 'classnames'
import './MultiSelectCombobox.scss'

interface Option {
  label: string
  value: unknown
}

interface Props {
  label: string
  options: Option[]
  value: unknown[]
  name: string
  onChange?: (event: { name: string; value: unknown[] }) => void
}

export function MultiSelectCombobox({ name, onChange, label, options, value }: Props) {
  const inputEl = useRef<HTMLInputElement>(null)
  const [isInFocus, setIsInFocus] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState('')
  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems
  } = useMultipleSelection<Option>({
    initialSelectedItems: value ? options.filter(o => value.includes(o.value)) : []
  })

  const getFilteredItems = () =>
    options.filter(
      item =>
        !selectedItems.includes(item) && item.label.toLowerCase().includes(inputValue.toLowerCase())
    )

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps
  } = useCombobox({
    inputValue,
    selectedItem: null,
    items: getFilteredItems(),
    onStateChange: ({ inputValue, selectedItem, type }: any) => {
      if (!inputValue) return
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(inputValue)
          break
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (selectedItem) {
            setInputValue('')
            addSelectedItem(selectedItem)
            onChange?.({ name, value: selectedItems.map(opt => opt.value) })
          }
          break
        default:
          break
      }
    }
  })

  const filteredItems = getFilteredItems()

  return (
    <div className="form-group multi-select-combobox">
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label {...getLabelProps()}>{label}</label>
      <div
        className={cx('form-control', { focused: isInFocus })}
        onClick={() => inputEl.current?.focus()}
      >
        {selectedItems.map((selectedItem, index) => (
          <span
            key={`selected-item-${index}`}
            {...getSelectedItemProps({ selectedItem, index })}
            className="badge badge-light"
          >
            {selectedItem.label}
            <button
              className="close"
              onClick={e => {
                e.stopPropagation()
                removeSelectedItem(selectedItem)
              }}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </span>
        ))}
        <div {...getComboboxProps()}>
          <input
            {...getInputProps({
              ...getDropdownProps({
                preventKeyAction: isOpen,
                ref: inputEl,
                onFocus: () => setIsInFocus(true),
                onBlur: () => setIsInFocus(false)
              })
            })}
          />
          <button
            {...getToggleButtonProps()}
            type="button"
            aria-label={'toggle menu'}
            className="dropdown-toggle"
          />
        </div>
      </div>

      <ul
        className={cx('dropdown-menu', { show: isOpen && filteredItems.length > 0 })}
        {...getMenuProps()}
      >
        {filteredItems.map((item, index) => (
          <li
            className={cx('dropdown-item', { active: highlightedIndex === index })}
            key={`${item.value}${index}`}
            {...getItemProps({ item, index })}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
