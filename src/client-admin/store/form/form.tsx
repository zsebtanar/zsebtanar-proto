import * as React from 'react'

interface Options {
  name: string
}

export const FormContext = React.createContext(undefined)

export const form = (options: Options) => (WrappedComponent) => {
  return <FormContext.Provider value={options.name}>
    <WrappedComponent/>
  </FormContext.Provider>
}
