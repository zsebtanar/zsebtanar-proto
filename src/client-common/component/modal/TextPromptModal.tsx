import * as React from 'react'
import { Button } from '../general/Button'
import { Dialog } from './base/Dialog'
import { DialogBody } from './base/DialogBody'
import { DialogFooter } from './base/DialogFooter'
import { DialogHeader } from './base/DialogHeader'

///

export interface TextPromptModalParams {
  title?: string
  onSuccess?: (value: string) => void
  buttonType?: ButtonType
  content?: React.ReactNode
  value?: string
  label: string
}

interface Props extends ui.ModalProps, TextPromptModalParams {}

interface State {
  value: string
}

///

export class TextPromptModal extends React.Component<Props, State> {
  state = { value: this.props.value || '' }

  public render() {
    const { label, close, content, title, buttonType } = this.props

    return (
      <Dialog className="confirm">
        {title && <DialogHeader onClose={close}>{title}</DialogHeader>}
        <DialogBody>
          {content}
          <div className="form-group">
            <label htmlFor="id=text-prompt-modal">{label}</label>
            <input
              autoFocus
              id="id=text-prompt-modal"
              type="text"
              className="form-control"
              required
              value={this.state.value}
              onChange={this.changeInput}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button onAction={close} className="btn-link">
            Mégsem
          </Button>
          <Button onAction={this.onOk} className={`btn-${buttonType || 'primary'}`}>
            Rendben
          </Button>
        </DialogFooter>
      </Dialog>
    )
  }

  private onOk = () => {
    this.props.onSuccess(this.state.value)
    this.props.close()
  }

  private changeInput = e => {
    this.setState({ value: e.currentTarget.value })
  }
}

// default export for dynamic import
export default TextPromptModal
