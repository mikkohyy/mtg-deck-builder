import { useState } from 'react'

const useViewWithPages = (lastPage) => {
  const FIRST_PAGE = 1
  const LAST_PAGE = lastPage

  const [pageNumber, setPageNumber] = useState(FIRST_PAGE)

  const isOnLastPage = () => {
    let onLastPage = false

    if (pageNumber === LAST_PAGE) {
      onLastPage = true
    }

    return onLastPage
  }

  const isOnFirstPage = () => {
    let onFirstPage = false

    if (pageNumber === FIRST_PAGE) {
      onFirstPage = true
    }

    return onFirstPage
  }

  const goToNextPage = () => {
    if (isOnLastPage !== true) {
      setPageNumber(pageNumber + 1)
    }
  }

  const goToPreviousPage = () => {
    if (isOnFirstPage !== true) {
      setPageNumber(pageNumber - 1)
    }
  }

  return {
    goToNextPage,
    goToPreviousPage,
    isOnLastPage,
    isOnFirstPage,
    setPageNumber,
    pageNumber
  }
}

export default useViewWithPages