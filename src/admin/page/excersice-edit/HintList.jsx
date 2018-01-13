import { __, dissoc, evolve, merge, pathOr, values } from 'ramda'
import { uid } from 'shared/util/uuid'
import { pairsInOrder } from 'shared/util/fn'
import React from 'react'
import { connect } from 'react-redux'
import { openInputModal } from 'shared/store/actions/modal'
import Button from 'shared/component/general/Button'
import Markdown from 'shared/component/general/Markdown'
import Icon from 'shared/component/general/Icon'

export default connect(undefined, { openInputModal })(
  class HintList extends React.Component {

    addHint = text =>
      this.setValue(
        evolve({
          hints: hints => ({ ...hints, [uid()]: { order: values(hints).length, text } })
        })
      )

    updateHint = (key, text) =>
      this.setValue(
        evolve({
          hints: { [key]: merge(__, { text }) }
        })
      )

    removeHint = key => this.setValue(evolve({ hints: dissoc(key) }))

    setValue = fn => {
      const data = fn(this.props)
      this.props.onChange(data.hints)
    }

    openAddHint = () => {
      this.props.openInputModal({
        title: 'Útmutató hozzáadása',
        label: 'Útmutató szövege',
        value: '',
        onUpdate: this.addHint
      })
    }

    openUpdateHint = key => () => {
      this.props.openInputModal({
        title: 'Útmutató módosítása',
        label: 'Útmutató szövege',
        value: pathOr('', ['hints', key, 'text'], this.props),
        onUpdate: text => this.updateHint(key, text)
      })
    }

    openRemoveHint = key => () =>
      confirm('Biztosan, hogy törölni szeretnéd?') && this.removeHint(key)

    render() {
      const hints = pairsInOrder(this.props.hints)
      return (
        <div>
          <div className="list-group my-2">
            {hints.length > 0 && hints.map(this.renderHint)}
            {!hints.length && (
              <div className="alert alert-info">
                Megadhatsz egy vagy több tippet a feladat megoldásához
              </div>
            )}
          </div>

          <Button
            title="Útmutató hozzáadása"
            onAction={this.openAddHint}
            className="btn btn-sm btn-outline-primary d-block mx-auto my-4"
          >
            <Icon fa="plus" /> Útmutató hozzáadása
          </Button>
        </div>
      )
    }

    renderHint = ([key, item], idx) => {
      return (
        <div
          key={key}
          className="list-group-item list-group-item-action flex-column align-items-start"
        >
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1 text-muted">{idx + 1}.</h5>
            <div>
              <Button className="btn-sm btn-link text-danger" onAction={this.openRemoveHint(key)}>
                <Icon fa="trash" /> Törlés
              </Button>
              <Button className="btn-sm btn-link" onAction={this.openUpdateHint(key)}>
                <Icon fa="edit" /> Módosítás
              </Button>
            </div>
          </div>
          <Markdown source={item.text} />
        </div>
      )
    }
  }
)
