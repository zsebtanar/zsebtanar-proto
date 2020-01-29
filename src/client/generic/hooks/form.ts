import { useState } from 'react'

export function useInput(initialValue = '') {
  const [value, setValue] = useState<string>(initialValue)

  return {
    set: setValue,
    value,
    bind: {
      value,
      onChange: event => {
        setValue(event.target.value)
      }
    }
  }
}

export function useRadio(initialValue?: string) {
  const [value, setValue] = useState<undefined | string>(initialValue)

  return {
    set: setValue,
    value,
    bind: {
      onChange: event => {
        setValue(event.target.value)
      }
    }
  }
}
