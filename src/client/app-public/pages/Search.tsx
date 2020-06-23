import React, { useEffect } from 'react'
import * as ReactGA from 'react-ga'
import { useParams } from 'react-router'
import { useAlgoliaSearch } from 'client/search/services/AlgoliaSearchService'
import { useInput } from 'client/generic/hooks'
import { Loading, ErrorMsg, PublicPage } from 'client/generic/components'
import { AlgoliaLogo } from 'client/search/components/AlgoliaLogo'
import { NavLink } from 'react-router-dom'
import { Markdown } from 'client/generic/components/markdown'
import { ExerciseSearchRecord, ExerciseSearchResult } from 'client/search/types'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const MIN_TERM_LENGTH = 2

export function Search() {
  const { q } = useParams()
  const { value: searchTerm, bind: bindSearch } = useInput(q ?? '')
  const { result, hasNoResult, isLoading, isSuccess, error } = useAlgoliaSearch(
    searchTerm,
    MIN_TERM_LENGTH,
  )

  useEffect(() => {
    if (result) {
      ReactGA.event({
        category: 'User',
        action: 'Search results',
        label: searchTerm,
        value: result.nbHits,
      })
    }
  }, [result, searchTerm])

  return (
    <PublicPage>
      <div className="mb-4 mx-auto col-md-8">
        <div className="search-input-group ">
          <label className="search-label" htmlFor="search-input">
            <FontAwesomeIcon icon={faSearch} size="lg" />
            <span className="sr-only">Feladat keresés</span>
          </label>
          <input
            id="search-input"
            type="text"
            className="form-control"
            placeholder="Feladat keresés ..."
            autoFocus
            {...bindSearch}
          />
        </div>
      </div>
      {searchTerm.length < MIN_TERM_LENGTH && (
        <div className="text-info col-md-8 mx-auto text-center">
          Írj be legalább 2 karaktert a keresés megkezdéséhez.
        </div>
      )}
      {isLoading && <Loading />}
      {error && <ErrorMsg error={error} />}
      {hasNoResult && <div className="alert alert-warning col-md-8 mx-auto">Nincs találat</div>}
      {isSuccess && result && <SearchResult term={searchTerm} data={result} />}
    </PublicPage>
  )
}

interface SearchResultProps {
  term: string
  data: ExerciseSearchResult
}

function SearchResult({ data, term }: SearchResultProps) {
  return (
    <div className="list-group col-md-10 mx-auto">
      <div className="mb-4 text-muted d-flex justify-content-between px-4">
        <div>
          <b>{data.nbHits}</b> találat
        </div>
        <div>
          <AlgoliaLogo />
        </div>
      </div>

      {data.hits.map(exercise => (
        <NavLink
          key={exercise.objectID}
          to={`/exercise/${exercise.objectID}`}
          className="list-group-item list-group-item-action d-flex flex-column align-items-start"
        >
          <div className="mb-1 d-flex w-100 ">
            <Markdown source={exercise.description} mark={term} />
          </div>
          <div>
            <SearchBadge exercise={exercise} category={'grade'} type={'light'} />
            <SearchBadge exercise={exercise} category={'subject'} type={'primary'} />
            <SearchBadge exercise={exercise} category={'topic'} type={'info'} />
            <SearchBadge exercise={exercise} category={'tags'} type={'secondary'} />
          </div>
        </NavLink>
      ))}
    </div>
  )
}

interface SearchBadgeProps {
  exercise: ExerciseSearchRecord
  category: string
  type: string
}

function SearchBadge({ exercise, category, type }: SearchBadgeProps) {
  return (exercise[category] || []).map(tag => (
    <span className={`badge badge-${type} mx-1`} key={tag}>
      {tag}
    </span>
  ))
}
