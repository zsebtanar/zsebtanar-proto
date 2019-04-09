import * as React from 'react'
import { FireStoreGridDS } from '../../services/fireStoreGridDS'
import { WikiPageModel, wikiPageService } from '../../services/wikiPageService'
import { Alert } from '../general/Alert'
import { Loading } from '../general/Loading'
import { Dialog } from './base/Dialog'
import { DialogBody } from './base/DialogBody'
import { DialogHeader } from './base/DialogHeader'

///

export interface WikiPageSelectorModalParams {
  onSelect?: (wikiPage: WikiPageModel) => void
}

interface Props extends ui.ModalProps, WikiPageSelectorModalParams {}

interface State {
  pages?: WikiPageModel[]
}

///

export class WikiPageSelectorModal extends React.Component<Props, State> {
  private ds = new FireStoreGridDS<WikiPageModel>(wikiPageService)
  state = { pages: undefined }

  async componentWillMount() {
    const pages = await this.ds.getPage(0, 1000)
    this.setState({ pages })
  }

  private select = item => () => {
    this.props.onSelect(item)
    this.props.close()
  }

  public render() {
    return (
      <Dialog className="confirm">
        <DialogHeader onClose={this.props.close}>Wiki oldalak</DialogHeader>
        <DialogBody>
          <div className="list-group">{this.renderContent()}</div>
        </DialogBody>
      </Dialog>
    )
  }

  private renderContent() {
    const { pages } = this.state
    if (!pages) {
      return <Loading />
    } else if (pages.length === 0) {
      return <Alert type={'info'}>Nincs találat</Alert>
    } else {
      return pages.map(this.renderListItem)
    }
  }

  private renderListItem = item => {
    return (
      <a
        key={item.id}
        href="#"
        className="list-group-item list-group-item-action"
        onClick={this.select(item)}
      >
        {item.title}
      </a>
    )
  }
}

// default export for dynamic import
export default WikiPageSelectorModal
