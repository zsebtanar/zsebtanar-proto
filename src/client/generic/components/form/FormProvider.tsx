import React, { ReactNode, useReducer, Reducer } from 'react'
import * as dp from 'dot-prop-immutable'
import { Service } from 'client/generic/services'
import { FieldDefinition } from 'client/generic/types'

interface Props<TModel> {
  children: ReactNode
  service: Service<TModel>
  fieldDefs: FieldDefinition[]
  id?: string
}

type State<TModel> = {
  status: 'loading' | 'idle' | 'changed' | 'saving' | 'error'
  fieldDefs: FieldDefinition[]
  model?: TModel
  error?: Error
}

interface FormContextAPI<TModel> {
  submit(): void
  setValue<K extends keyof TModel>(name: K, value: TModel[K]): void
}

type FormActions<TModel> =
  | { type: 'Load' }
  | { type: 'Loaded'; payload: { model: TModel; fieldDefs: FieldDefinition[] } }
  | { type: 'New'; payload: { model: TModel; fieldDefs: FieldDefinition[] } }
  | { type: 'Submit' }
  | { type: 'SetValue'; payload: { name: keyof TModel; value: TModel[keyof TModel] } }
  | { type: 'Error'; payload: { error: Error } }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FormContext = React.createContext<State<unknown>>({} as any)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FormDispatchContext = React.createContext<FormContextAPI<unknown>>({} as any)

export function FormProvider<TModel>({ children, service, fieldDefs, id }: Props<TModel>) {
  const [state, dispatch] = useReducer<Reducer<State<TModel>, FormActions<TModel>>>(formReducer, {
    status: 'loading',
    fieldDefs: [],
    model: undefined
  })

  // Init
  React.useEffect(() => {
    if (id) {
      service.get(id).then(
        model => dispatch({ type: 'Loaded', payload: { model, fieldDefs } }),
        error => dispatch({ type: 'Error', payload: { error } })
      )
    } else {
      dispatch({ type: 'New', payload: { model: {} as TModel, fieldDefs } })
    }
  }, [id, fieldDefs, service])

  const api: FormContextAPI<TModel> = {
    submit() {
      dispatch({ type: 'Submit' })
    },
    setValue<K extends keyof TModel>(name: K, value: TModel[K]) {
      dispatch({ type: 'SetValue', payload: { name, value } })
    }
  }

  return (
    <FormContext.Provider value={state}>
      <FormDispatchContext.Provider value={api}>{children}</FormDispatchContext.Provider>
    </FormContext.Provider>
  )
}

export function useForm() {
  const context = React.useContext(FormContext)
  if (context === undefined) {
    throw new Error('useForm must be used within a FormContext')
  }
  return context
}

export function useFormDispatch() {
  const context = React.useContext(FormDispatchContext)
  if (context === undefined) {
    throw new Error('useFormDispatch must be used within a FormDispatchContext')
  }
  return context
}

function formReducer<TModel>(state: State<TModel>, action: FormActions<TModel>): State<TModel> {
  switch (action.type) {
    case 'Load':
      return { ...state, status: 'loading', model: undefined, fieldDefs: [] }
    case 'New':
    case 'Loaded': {
      const { model, fieldDefs } = action.payload
      return { ...state, status: 'idle', model, fieldDefs }
    }
    case 'Submit':
      if (state.model) {
        return { ...state, model: state.model, status: 'saving' }
      } else {
        return {
          ...state,
          status: 'error',
          error: new Error('Load model before you try to save it')
        }
      }
    case 'SetValue': {
      const { name, value } = action.payload
      const model = dp.set(state.model, name as string, value)
      return { ...state, status: 'changed', model }
    }
    case 'Error':
      return { ...state, status: 'error', error: action.payload.error }
  }
}
