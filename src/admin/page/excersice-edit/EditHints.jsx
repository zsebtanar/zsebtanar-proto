import { pathOr } from 'ramda'
import { pairsInOrder } from 'shared/util/fn'
import React from 'react'
import { connect } from 'react-redux'
import Button from 'shared/component/general/Button'
import Markdown from 'shared/component/general/Markdown'
import { openInputModal } from 'shared/store/actions/modal'

export default connect(undefined, { openInputModal })(
  class EditHints extends React.Component {
    addHint = () => {
      this.props.openInputModal({
        title: 'Útmutató hozzáadása',
        label: 'Útmutató szövege',
        value: '',
        onUpdate: this.props.onAdd
      })
    }

    updateHint = key => () => {
      this.props.openInputModal({
        title: 'Útmutató módosítása',
        label: 'Útmutató szövege',
        value: pathOr('', ['hints', key, 'text'], this.props),
        onUpdate: text => this.props.onUpdate(key, text)
      })
    }

    removeHint = key => () => (confirm('Biztosan törli?') ? this.props.onRemove(key) : undefined)

    render() {
      const hints = pairsInOrder(this.props.hints)
      return (
        <div>
          <div className="list-group my-2">
            {hints.length ? (
              hints.map(this.renderHint)
            ) : (
              <div className="alert alert-info">Megadhatsz egy vagy több tippet a feladat megoldásához</div>
            )}
          </div>

          <Button
            title="Add hint"
            onAction={this.addHint}
            className="btn btn-sm btn-outline-primary d-block mx-auto my-4"
          >
            <i className="fa fa-plus" /> Útmutató hozzáadása
          </Button>
        </div>
      )
    }

    renderHint = ([key, item], idx) => {
      return (
        <div key={key} className="list-group-item list-group-item-action flex-column align-items-start">
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1 text-muted">{idx + 1}.</h5>
            <div>
              <Button className="btn-sm btn-link text-danger" onAction={this.removeHint(key)}>
                <i className="fa fa-trash" /> Törlés
              </Button>
              <Button className="btn-sm btn-link" onAction={this.updateHint(key)}>
                <i className="fa fa-edit" /> Módosítás
              </Button>
            </div>
          </div>
          <Markdown source={item.text} />
        </div>
      )
    }
  }
)
