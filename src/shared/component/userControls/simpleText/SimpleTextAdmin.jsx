import React from 'react'
import { assocPath, dissocPath, pathOr, toPairs } from 'ramda'
import { uid } from 'shared/util/uuid'
import { connect } from 'react-redux'
import { openInputModal } from 'shared/store/actions/modal'
import { TrashButton } from 'shared/component/userControls/common/TrashButton'
import { MarkdownField } from 'shared/component/userControls/common/MarkdownField'
import { Button } from 'shared/component/general/Button'
import { Checkbox } from 'shared/component/input/Checkbox'

export const SimpleTextAdmin = connect(undefined, { openInputModal })(
  class extends React.Component {
    constructor(props) {
      super(props)

      this.state = {
        prefix: pathOr(null, ['value', 'prefix'], props),
        postfix: pathOr(null, ['value', 'postfix'], props),
        solution: pathOr(
          {
            ignoreSpaces: pathOr(false, ['value', 'ignoreSpaces'], props),
            caseSensitive: pathOr(true, ['value', 'caseSensitive'], props),
            options: false
          },
          ['value', 'solution'],
          props
        )
      }
    }

    componentWillMount() {
      if (!this.state.solution.options) {
        this.addSolution()
      }
    }

    editLabel = ({ name, value }) => this.updateState({ [name]: value })

    addSolution = () => {
      this.updateState(assocPath(['solution', 'options', uid()], 'Megoldás', this.state))
    }

    setSolution = e => {
      const { name, value } = e.currentTarget
      this.updateState(assocPath(['solution', 'options', name], value, this.state))
    }

    delSolution = key => () => {
      this.updateState(dissocPath(['solution', 'options', key], this.state))
    }

    setOption = e => {
      const { name, checked } = e.currentTarget
      this.updateState(assocPath(['solution', name], checked, this.state))
    }

    updateState = data => {
      const state = { ...this.state, ...data }
      this.setState(state)
      if (this.props.onChange) {
        this.props.onChange({ value: state, name: this.props.name })
      }
    }

    render() {
      const { prefix, postfix } = this.state
      const solution = toPairs(this.state.solution.options)

      return (
        <div className="user-control simple-text simple-text-admin">
          <div>
            <Checkbox
              name="ignoreSpaces"
              checked={this.state.solution.ignoreSpaces}
              onChange={this.setOption}
            >
              Szóközök figyelmen kívül hagyása
            </Checkbox>
          </div>
          <div className="my-2">
            <Checkbox
              name="caseSensitive"
              checked={this.state.solution.caseSensitive}
              onChange={this.setOption}
            >
              Kis- és nagybetűk megkülönböztetése
            </Checkbox>
          </div>

          <MarkdownField
            label="Előtag"
            name="prefix"
            value={prefix}
            placeholder="Üres"
            onChange={this.editLabel}
            resources={this.props.resources}
            cleanable
          />
          <MarkdownField
            label="Utótag"
            name="postfix"
            value={postfix}
            placeholder="Üres"
            onChange={this.editLabel}
            resources={this.props.resources}
            cleanable
          />
          <div className="form-group row">
            <label className="col-3 col-form-label">Megoldások:</label>
            <div className="col-9">
              <ol className="list-unstyled">
                {solution.map(item => this.renderItem(item, solution.length < 2))}
              </ol>
            </div>
          </div>
          <div className="form-group row">
            <div className="col-9 ml-auto">
              <Button
                className="btn-sm btn-outline-primary d-block mx-auto"
                onAction={this.addSolution}
              >
                <i className="fa fa-plus" /> Alternatív megoldás megadása
              </Button>
            </div>
          </div>
        </div>
      )
    }

    renderItem = ([key, text], isLast) => {
      return (
        <li key={key}>
          <div className="d-flex">
            <input
              type="text"
              className="form-control mt-1"
              value={text}
              name={key}
              required
              onChange={this.setSolution}
            />
            {isLast ? '' : <TrashButton onAction={this.delSolution(key)} />}
          </div>
        </li>
      )
    }
  }
)
