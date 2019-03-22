import * as React from 'react'
import { WikiPageModel, wikiPageService } from '../../services/wikiPageService'
import { Button } from '../general/Button'
import { Loading } from '../general/Loading'
import { Markdown } from '../general/Markdown'
import { Dialog } from './base/Dialog'
import { DialogBody } from './base/DialogBody'
import { DialogHeader } from './base/DialogHeader'

import './WikiModal.scss'

///

export interface WikiModalParams {
  pageId: string
}

interface Props extends ui.ModalProps, WikiModalParams {}

interface State {
  history?: WikiPageModel[]
  activePage: number
}

///

export class WikiModal extends React.Component<Props, State> {
  state = {
    history: [],
    activePage: 0
  }

  public componentWillMount() {
    const { pageId } = this.props
    this.loadPage(pageId)
  }

  private async loadPage(pageId: string) {
    const page = await wikiPageService.get(pageId)
    this.setState({ history: [...this.state.history, page] })
  }

  public render() {
    const { history, activePage } = this.state
    const page: WikiPageModel = history[activePage]
    return (
      <Dialog className="wiki-modal">
        <DialogHeader onClose={this.props.close}>
          <Button
            className="btn-sm btn-light nav-back"
            icon="arrow-left"
            onAction={this.navBackward}
            disabled={activePage === 0}
          />
          {(page && page.title) || ''}
        </DialogHeader>
        <DialogBody>
          <div className="list-group">{this.renderContent(page)}</div>
        </DialogBody>
      </Dialog>
    )
  }

  private renderContent(page) {
    if (!page) {
      return <Loading />
    } else {
      return (
        <Markdown source={page.content} resources={page.resources} onWikiLink={this.navForward} />
      )
    }
  }

  private navForward = (pageId: string) => {
    this.setState({ activePage: this.state.activePage + 1 })
    this.loadPage(pageId)
  }

  private navBackward = () => {
    this.setState({ activePage: this.state.activePage - 1 })
  }
}

// default export for dynamic import
export default WikiModal
