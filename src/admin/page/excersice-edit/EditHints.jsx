import { pathOr } from 'ramda'
import { pairsInOrder } from 'shared/util/fn'
import React from 'react'
import { connect } from 'react-redux'
import Button from 'shared/component/general/Button'
import Markdown from 'shared/component/general/Markdown'
import { openInputModal } from 'shared/store/actions/modal'

export default connect(undefined, {openInputModal})(class EditHints extends React.Component {
  addHint = () => {
    this.props.openInputModal({
      title: 'Tipp hozzáadása',
      label: 'Tipp szövege',
      value: '',
      onUpdate: this.props.onAdd
    })
  }

  updateHint = (key) => () => {
    this.props.openInputModal({
      title: 'Tipp módosítása',
      label: 'Tipp szövege',
      value: pathOr('', ['hints', key, 'text'], this.props),
      onUpdate: text => this.props.onUpdate(key, text)
    })
  }

  removeHint = (key) => () =>
    this.props.onRemove(key)

  renderHint = ([key, item], idx) => {
    return (
      <div key={key} className="list-group-item list-group-item-action flex-column align-items-start">
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-1 text-muted">{idx + 1}.</h5>
          <div>
            <Button className="btn-sm btn-link" onAction={this.updateHint(key)}>
              <i className="fa fa-edit"/>
            </Button>
            <Button className="btn-sm btn-link text-danger" onAction={this.removeHint(key)}>
              <i className="fa fa-trash"/>
            </Button>
          </div>
        </div>
        <Markdown source={item.text}/>
      </div>
    )
  }

  render () {
    const hints = pairsInOrder(this.props.hints)
    return <div>
      <div className="d-flex justify-content-between align-items-center">
        <h4>Megoldási útmutatók</h4>
        <Button title="Add hint" onAction={this.addHint}>
          <i className="fa fa-plus"/>
        </Button>
      </div>

      <div className="my-2">
        <div className="list-group">
          {
            hints.length
              ? hints.map(this.renderHint)
              : <div className="alert alert-info">Megadhatsz egy vagy több tippet a feladat megoldásához</div>
          }
        </div>
      </div>
    </div>
  }
})
