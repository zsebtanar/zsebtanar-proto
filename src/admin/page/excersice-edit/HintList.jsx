import React from 'react'
import { __, assocPath, dissoc, evolve, merge, pathOr, values } from 'ramda'
import { uid } from 'shared/util/uuid'
import { listToOrderedObject, pairsInOrder } from 'shared/util/fn'
import { connect } from 'react-redux'
import { openInputModal } from 'shared/store/actions/modal'
import { Sortable } from 'shared/component/general/Sortable'
import { Button } from 'shared/component/general/Button'
import { Icon } from 'shared/component/general/Icon'
import { HintItem } from './HintItem'

function mapStateToProps(state) {
  return {
    resources: state.exerciseEdit.resources
  }
}

const mapDispatchToProps = {
  openInputModal
}

export const HintList = connect(mapStateToProps, mapDispatchToProps)(
  class extends React.Component {
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

    orderUpdate = list => {
      this.setValue(assocPath(['hints'], listToOrderedObject(list)))
    }

    render() {
      const hints = pairsInOrder(this.props.hints)
      return (
        <div>
          <div className="list-group my-2">
            {hints.length > 0 ? (
              <Sortable
                list={hints}
                itemComponent={HintItem}
                onChange={this.orderUpdate}
                itemProps={{
                  openUpdateHint: this.openUpdateHint,
                  openRemoveHint: this.openRemoveHint,
                  resources: this.props.resources
                }}
              />
            ) : (
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
  }
)
