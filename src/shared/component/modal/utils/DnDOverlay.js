import * as React from 'react'

const events = ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop']

export class DnDOverlay extends React.Component {
  counter = 0

  prevent = e => {
    e.preventDefault()
    e.stopPropagation()
  }

  addClass = () => {
    this.counter++
    document.body.classList.add('is-dragover')
  }

  removeClass = e => {
    this.counter--
    if (e.type === 'drop') this.counter = 0
    if (!this.counter) {
      document.body.classList.remove('is-dragover')
    }
  }

  componentDidMount() {
    events.map(eventName => {
      document.addEventListener(eventName, this.prevent)
    })

    document.addEventListener('dragover', this.addClass, false)
    document.addEventListener('dragenter', this.addClass, false)
    document.addEventListener('dragleave', this.removeClass, false)
    document.addEventListener('dragend', this.removeClass, false)
    document.addEventListener('drop', this.removeClass, false)
  }

  componentWillUnmount() {
    events.map(eventName => {
      document.removeEventListener(eventName, this.prevent)
    })

    document.removeEventListener('dragover', this.addClass, false)
    document.removeEventListener('dragenter', this.addClass, false)
    document.removeEventListener('dragleave', this.removeClass, false)
    document.removeEventListener('dragend', this.removeClass, false)
    document.removeEventListener('drop', this.removeClass, false)
  }

  render() {
    return (
      <div className="dnd-overlay">
        <div className="msg-block">
          <div className="block-item">
            <i className="fa fa-upload fa-5x" />
            <br />
            <br />
            Csak dobd ide a feltöltendő fájlokat.
          </div>
        </div>
      </div>
    )
  }
}
