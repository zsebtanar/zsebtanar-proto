import * as React from 'react'
import { search } from '../../services/search'
import { AlgoliaLogo } from '../general/AlgoliaLogo'
import { Button } from '../general/Button'
import { Icon } from '../general/Icon'
import { Loading } from '../general/Loading'
import { Markdown } from '../general/Markdown'
import { Dialog } from './base/Dialog'
import { DialogBody } from './base/DialogBody'
import { DialogFooter } from './base/DialogFooter'
import { DialogHeader } from './base/DialogHeader'

interface ConfirmModalProps extends ui.ModalProps {
  onSuccess: (exerciseId: string) => void
  filterOut: string[]
  buttonType?: ButtonType
  content: React.ReactNode
}

export class ExerciseSearchModal extends React.Component<ConfirmModalProps> {
  state = {
    list: undefined,
    error: undefined,
    loading: false,
    term: ''
  }
  private isOpen = true

  componentWillUnmount(): void {
    this.isOpen = false
  }

  private onSearch = event => this.searchTerm(event.currentTarget.value)

  private searchTerm = term => {
    if (term.length >= 2) {
      this.setState({ loading: true, list: undefined })

      search(term)
        .then(
          list => this.isOpen && this.setState({ list, error: undefined, loading: false, term })
        )
        .catch(error => this.isOpen && this.setState({ error, loading: false }))
    } else {
      this.setState({ loading: false, list: undefined, term: '' })
    }
  }

  private selectExercise = id => {
    this.props.onSuccess(id)
    this.props.close()
  }

  public render() {
    return (
      <Dialog className="confirm" size="large">
        {this.props.title && (
          <DialogHeader onClose={this.props.close}>{this.props.title}</DialogHeader>
        )}
        <DialogBody>{this.renderBody()}</DialogBody>
        <DialogFooter>
          <Button onAction={this.props.close} className="btn-link">
            Mégsem
          </Button>
        </DialogFooter>
      </Dialog>
    )
  }

  private renderBody() {
    return (
      <div>
        <div className="mb-4 mx-auto col-md-8">
          <div className="search-input-group ">
            <label className="search-label" htmlFor="search-input">
              <Icon fa="search" size="lg" />
              <span className="sr-only">Feladat keresés</span>
            </label>
            <input
              id="search-input"
              type="text"
              className="form-control"
              onInput={this.onSearch}
              placeholder="Feladat keresés ..."
              autoFocus
            />
          </div>
        </div>
        {this.renderContent()}
      </div>
    )
  }

  private renderContent() {
    const { list, loading, error } = this.state

    if (loading) return <Loading />
    if (error) return this.renderError()
    if (list) {
      if (list.nbHits > 0) return this.renderResult()
      return this.renderEmpty()
    }
    return this.renderInfo()
  }

  private renderResult() {
    const { list, term } = this.state
    return (
      <div className="list-group col-md-10 mx-auto">
        <div className="mb-4 text-muted d-flex justify-content-between px-4">
          <div>
            <b>{list.nbHits}</b> találat
          </div>
          <div>
            <AlgoliaLogo />
          </div>
        </div>

        {list.hits.map(this.renderResultItem(term))}
      </div>
    )
  }

  private renderResultItem = term => exercise => {
    const { filterOut } = this.props;
    const isDisabled = !!(filterOut && filterOut.find(id => id === exercise.objectID))
    return (
      <div
        key={exercise.objectID}
        className="list-group-item list-group-item-action d-flex flex-column align-items-start"
        style={{opacity: isDisabled ? 0.3 : 1}}
        onClick={() => !isDisabled && this.selectExercise(exercise.objectID)}
      >
        <div className="mb-1 d-flex w-100 ">
          <Markdown source={exercise.description} mark={term} />
        </div>
        <div>
          {this.renderBadge(exercise, 'grade', 'light')}
          {this.renderBadge(exercise, 'subject', 'primary')}
          {this.renderBadge(exercise, 'topic', 'info')}
          {this.renderBadge(exercise, 'tags', 'secondary')}
        </div>
      </div>
    )
  }

  private renderBadge(exercise, key, type) {
    return (exercise[key] || []).map(this.renderBadgeItem(type))
  }

  private renderBadgeItem = type => item => {
    return (
      <span className={`badge badge-${type} mx-1`} key={item}>
        {item}
      </span>
    )
  }

  private renderError() {
    const { error } = this.state
    return <div className="alert alert-danger col-md-8 mx-auto">{error.message}</div>
  }

  private renderInfo() {
    return (
      <div className="text-info col-md-8 mx-auto text-center">
        Írj be legalább 2 karaktert a keresés megkezdéséhez.
      </div>
    )
  }

  private renderEmpty() {
    return <div className="alert alert-warning col-md-8 mx-auto">Nincs találat</div>
  }
}

// default export for dynamic import
export default ExerciseSearchModal
