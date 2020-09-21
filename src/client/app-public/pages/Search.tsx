import React, { useEffect } from 'react'
import * as ReactGA from 'react-ga'
import { useParams } from 'react-router'
import { useAlgoliaSearch } from 'client/search/services/AlgoliaSearchService'
import { AlgoliaLogo } from 'client/search/components/AlgoliaLogo'
import { ExerciseSearchResult } from 'client/search/types'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useInput } from '../../generic/hooks/input'
import { Loading } from 'client/generic/components/Loading'
import { ErrorMsg } from 'client/generic/components/ErrorMsg'
import { PublicPage } from 'client/generic/components/PublicPage'
import { ExerciseListItem } from 'client/exercise/components/ExerciseListItem'

const MIN_TERM_LENGTH = 2

export function Search(): JSX.Element {
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
      {searchTerm.length > MIN_TERM_LENGTH && hasNoResult && (
        <div className="alert alert-warning col-md-8 mx-auto">Nincs találat</div>
      )}
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

      {data.hits.map((exercise) => (
        <ExerciseListItem
          key={exercise.objectID}
          id={exercise.objectID}
          mark={term}
          classifications={exercise.classifications}
          description={exercise.description}
        />
      ))}
    </div>
  )
}
