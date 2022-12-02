import AddCardSet from '../AddCardSet'
import { useState } from 'react'
import FunctionalityNavButton from '../../Generic/FunctionalityNavButton'

const AddCardSetButtonAndWindow = ({ activeSubWindow, setActiveSubWindow }) => {
  const WINDOW_NAME = 'ADD_SET'
  const [addCardSetIsOpen, setAddCardSetIsOpen] = useState(false)

  const toggleAddCardSet = () => {
    if (activeSubWindow === undefined && addCardSetIsOpen === false) {
      setAddCardSetIsOpen(true)
      setActiveSubWindow(WINDOW_NAME)
    } else if (activeSubWindow === WINDOW_NAME && addCardSetIsOpen === true) {
      setAddCardSetIsOpen(false)
      setActiveSubWindow(undefined)
    }
  }

  return(
    <div>
      <FunctionalityNavButton text='Add card set' onClick={toggleAddCardSet} />
      { addCardSetIsOpen === true
        ? <AddCardSet
          setAddCardSetIsOpen={addCardSetIsOpen}
          setActiveSubWindow={setActiveSubWindow}
          toggleAddCardSet={toggleAddCardSet}
        />
        : null
      }
    </div>
  )
}

export default AddCardSetButtonAndWindow