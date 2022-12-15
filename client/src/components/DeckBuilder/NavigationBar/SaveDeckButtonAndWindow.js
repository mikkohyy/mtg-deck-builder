import SaveDeckWindow from '../SaveDeckWindow'
import FunctionalityNavButton from '../../Generic/FunctionalityNavButton'
import { useState } from 'react'

const SaveDeckButtonAndWindow = ({ activeSubWindow, setActiveSubWindow }) => {
  const WINDOW_NAME = 'SAVE_DECK'
  const [saveDeckIsOpen, setSaveDeckIsOpen] = useState(false)

  const toggleSaveDeck = () => {
    if (activeSubWindow === undefined && saveDeckIsOpen === false) {
      setSaveDeckIsOpen(true)
      setActiveSubWindow(WINDOW_NAME)
    } else if (activeSubWindow === WINDOW_NAME && saveDeckIsOpen === true) {
      setSaveDeckIsOpen(false)
      setActiveSubWindow(undefined)
    }
  }

  return(
    <div>
      <FunctionalityNavButton text='Save deck' onClick={toggleSaveDeck}/>
      { saveDeckIsOpen === true
        ? <SaveDeckWindow toggleSaveDeck={toggleSaveDeck} />
        : null
      }
    </div>
  )
}

export default SaveDeckButtonAndWindow