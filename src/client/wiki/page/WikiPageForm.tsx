import React from 'react'
import { Loading, Alert, Icon, Button, FormGroup } from 'client/generic/components'
import { Simulate } from 'react-dom/test-utils'
import { NavLink } from 'react-router-dom'
import { TextEditor } from 'client/generic/components/TextEditor'
import { FormField, RepresentationType } from 'client/generic/types'
import { useForm } from 'client/generic/hooks/form'
import { WikiPageModel } from 'client/wiki/types'
import error = Simulate.error


const formFields: FormField[] = [
  {
    name: 'title',
    representation: {
      type: RepresentationType.Text
    }
  },
  {
    name: 'content',
    representation: {
      type: RepresentationType.Markdown
    }
  }
]

export function WikiPageForm() {
  const { model } = useForm<WikiPageModel>({} as any, formFields)
  return (
    <div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <NavLink
            exact
            to="/wiki-page"
            className="btn btn-outline-light py-0 text-dark mx-2"
            title="Mégsem"
          >
            <Icon fa="angle-left" size="2x" />
          </NavLink>
          <h4 className="d-inline-block m-0 mr-1">Wiki oldal</h4>
        </div>
        <div>
          {data && data.id && (
            <Button className="btn btn-outline-danger" onAction={this.props.removePage} icon="trash">
              Törlés
            </Button>
          )}
          <Button
            loading={saving}
            disabled={!changed}
            className="btn btn-primary ml-1"
            onAction={this.props.savePage}
            icon="save"
          >
            Mentés
          </Button>
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : error ? (
        <Alert type={'danger'}>{JSON.stringify(error)}</Alert>
      ) : (
        this.renderContent()
      )}
    </div>
  )
}

const renderHeader = () => {
  const { saving, changed, data } = this.props.wiki

  return (
  )
}

const renderContent = () => {
  const { setField, wiki, resources } = this.props
  return (
    <div className="row">
      <div className="col-10 mx-auto">
        <FormGroup label="Wiki oldal címe">
          <input
            className="form-control"
            type="text"
            name="title"
            required
            onChange={e => setField(titleL, e.currentTarget.value)}
            value={view(titleL, wiki)}
          />
        </FormGroup>

        <div>
          <TextEditor
            className="form-group"
            name="description"
            rows={10}
            required
            onChange={e => setField(contentL, e.value)}
            value={view(contentL, wiki)}
            resources={resources}
          />
        </div>
      </div>
    </div>
  )
}
