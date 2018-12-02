import * as React from 'react'
import * as PropTypes from 'prop-types'
import { path as ramdaPath } from 'ramda'
import { reduceToObj } from '../../../shared/util/fn'

///

type PathFn<P> = (props: P) => string[]
type Path<P> = string | string[] | PathFn<P>

interface Options<P> {
  path: Path<P>
  fields: string[]
  setFieldAction: (path: string[], value: any) => void
  getInitialState?: (props: P) => any
  resetFieldAction?: (path: string[]) => void
}

interface FormFields {
  $values: () => { [key: string]: any }
  $setValue: (field: string, value: any) => void
  $reset: () => void
  [key: string]:
    | {
        name: string
        onChange: () => void
      }
    | any
}
export interface FormFieldProps {
  fields: FormFields
}

interface FormFieldsState {
  model: any
}

///

export const formFields = <Prop extends object>(options: Options<Prop>) => (
  WrappedComponent: React.ComponentClass<Prop>
) => {
  const { path, getInitialState } = options

  return class FormFieldsComponent extends React.Component<Prop, FormFieldsState> {
    static contextTypes = {
      store: PropTypes.object // Redux store.
    }

    state = {
      model: null
    }

    fields: FormFields
    values: any
    unsubscribe: () => void

    private onFieldChange = (field, value) => {
      const normalizedPath = getNormalizePath(this.props).concat(field)
      this.context.store.dispatch(options.setFieldAction(normalizedPath, value))
    }

    private createFields() {
      const formFields = reduceToObj(
        field => createFieldObject(field, this.onFieldChange),
        options.fields
      )

      this.fields = {
        ...formFields,
        $values: () => this.values,
        $setValue: (field, value) => this.onFieldChange(field, value),
        $reset: () => {
          if (options.resetFieldAction) {
            const normalizedPath = getNormalizePath(this.props)
            this.context.store.dispatch(options.resetFieldAction(normalizedPath))
          }
        }
      }
    }

    private getModelFromState() {
      const normalizedPath = getNormalizePath(this.props)
      return ramdaPath(normalizedPath, this.context.store.getState().fields)
    }

    private setModel(model) {
      this.values = lazyJsonValuesOf(model, this.props)
      options.fields.forEach(field => {
        this.fields[field].value = this.values[field]
      })
      this.fields = { ...this.fields } // Ensure rerender for pure components.
      this.setState({ model })
    }

    componentWillMount() {
      this.createFields()
      this.setModel(this.getModelFromState())
    }

    componentDidMount() {
      const { store } = this.context
      this.unsubscribe = store.subscribe(() => {
        const newModel = this.getModelFromState()
        if (newModel === this.state.model) return
        this.setModel(newModel)
      })
    }

    componentWillUnmount() {
      this.unsubscribe()
    }

    render() {
      return <WrappedComponent {...this.props} {...{fields: this.fields}} />
    }
  }

  ///

  function getNormalizePath(props): string[] {
    switch (typeof path) {
      case 'function':
        return (path as PathFn<any>)(props)
      case 'string':
        return [path as string]
      default:
        return path as string[]
    }
  }

  function getFieldValue(field, model, initialState) {
    if (model && model.hasOwnProperty(field)) {
      return model[field]
    }
    if (initialState && initialState.hasOwnProperty(field)) {
      return initialState[field]
    }
    return ''
  }

  function lazyJsonValuesOf(model, props) {
    const initialState = getInitialState && getInitialState(props)
    // http://www.devthought.com/2012/01/18/an-object-is-not-a-hash
    return reduceToObj(field => getFieldValue(field, model, initialState), options.fields)
  }

  function createFieldObject(field, onChange) {
    return {
      name: field,
      onChange: event => {
        // Some custom components like react-select pass the target directly.
        const target = event.target || event
        const { type, checked, value } = target
        const isCheckbox = type && type.toLowerCase() === 'checkbox'
        onChange(field, isCheckbox ? checked : value)
      }
    }
  }
}
