import React, {
  useState,
  useMemo,
  useReducer,
  Reducer,
  ReactNode,
  Dispatch,
  FormEvent
} from 'react'
import * as dp from 'dot-prop-immutable'
import {
  FieldOnChange,
  Representation,
  FieldDefinition,
  FieldDefinitionList
} from 'client/generic/types'
import { useFetchData } from 'client/generic/hooks/fetchData'
import { WikiPageModel } from 'client/wiki/types'
import { wikiPageService } from 'client/wiki/services/wikiPageService'
import { Service, BaseModel } from '../services'

interface Field<TName, TValue> {
  name: TName
  value: TValue
  representation: Representation
  onChange: FieldOnChange<TValue>
}

type FieldList<TModel> = Field<keyof TModel, TModel[keyof TModel]>[]

interface Output<T> {
  isLoading: boolean
  submit: (event?: FormEvent) => void
}

interface Props<TModel> {
  children: ReactNode
  service: Service<TModel>
  fieldDefs: FieldDefinitionList<TModel>
  id?: string
}

type State<TModel> = {
  status: 'loading' | 'idle' | 'changed' | 'submitting' | 'error'
  fields: FieldList<TModel>
  model?: TModel
  error?: Error
}

type FormActions<TModel> =
  | { type: 'Load' }
  | { type: 'Loaded'; payload: { model: TModel; fields: FieldList<TModel> } }
  | { type: 'New'; payload: { model: TModel; fields: FieldList<TModel> } }
  | { type: 'SetValue'; payload: { name: keyof TModel; value: TModel[keyof TModel] } }
  | { type: 'Submit' }
  | { type: 'Saved' }
  | { type: 'Error'; payload: { error: Error } }

export const NEW_MODEL = Symbol('new model')

export function useForm<TModel>(
  id: string | typeof NEW_MODEL,
  fieldDef: FieldDefinitionList<TModel>,
  getModel: (id: string) => Promise<TModel>,
  saveModel: (model: TModel) => Promise<void>
): Output<TModel> {
  const [state, dispatch] = useReducer<Reducer<State<TModel>, FormActions<TModel>>>(formReducer, {
    status: 'loading',
    fields: [],
    model: undefined
  })

  React.useEffect(() => {
    if (state.status === 'submitting' && state.model) {
      saveModel(state.model).then(
        () => dispatch({ type: 'Saved' }),
        error => dispatch({ type: 'Error', payload: { error } })
      )
    }
  }, [state.status])

  React.useEffect(() => {
    if (id === NEW_MODEL) {
      dispatch({
        type: 'New',
        payload: { model: {} as TModel, fields: createFields(fieldDef, {} as TModel, dispatch) }
      })
    } else {
      getModel(id).then(
        model =>
          dispatch({
            type: 'Loaded',
            payload: { model, fields: createFields(fieldDef, model, dispatch) }
          }),
        error => dispatch({ type: 'Error', payload: { error } })
      )
    }
  }, [id, getModel, fieldDef])

  return {
    isLoading: state.status === 'loading',
    submit: event => {
      event?.preventDefault()
      dispatch({ type: 'Submit' })
    }
  }
}

function createFields<TModel>(
  fieldDef: FieldDefinitionList<TModel>,
  model: TModel,
  dispatch: Dispatch<FormActions<TModel>>
): FieldList<TModel> {
  return fieldDef.map(({ name, defaultValue, representation }) => {
    const value = dp.get(model, name, defaultValue ?? undefined)
    return {
      value,
      representation,
      onChange: value =>
        dispatch({ type: 'SetValue', payload: { name: name as keyof TModel, value } })
    }
  })
}

function formReducer<TModel>(state: State<TModel>, action: FormActions<TModel>): State<TModel> {
  switch (action.type) {
    case 'Load':
      return { ...state, status: 'loading', model: undefined, fields: [] }
    case 'New':
    case 'Loaded': {
      const { model, fields } = action.payload
      return { ...state, status: 'idle', model, fields }
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
