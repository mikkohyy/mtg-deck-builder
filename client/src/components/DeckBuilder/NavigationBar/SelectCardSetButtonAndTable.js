import { useState } from 'react'
import FunctionalityNavButton from '../../Generic/FunctionalityNavButton'
import CardSetsList from '../CardSetsList'

const SelectCardSetButtonAndTable = ({ activeSubWindow, setActiveSubWindow }) => {
  const WINDOW_NAME = 'SELECT_SET'
  const [selectCardSetIsOpen, setSelectCardSetIsOpen] = useState(false)

  const openCardSetSelection = () => {
    if (activeSubWindow === undefined && selectCardSetIsOpen === false) {
      setSelectCardSetIsOpen(true)
      setActiveSubWindow(WINDOW_NAME)
    } else if (activeSubWindow === WINDOW_NAME && selectCardSetIsOpen === true) {
      setSelectCardSetIsOpen(false)
      setActiveSubWindow(undefined)
    }
  }

  return(
    <div>
      <FunctionalityNavButton text='Open card set' onClick={openCardSetSelection} />
      { selectCardSetIsOpen === true
        ? <CardSetsList
          setSelectCardSetIsOpen={setSelectCardSetIsOpen}
          setActiveSubWindow={setActiveSubWindow}
        />
        : null
      }
    </div>
  )
}

export default SelectCardSetButtonAndTable