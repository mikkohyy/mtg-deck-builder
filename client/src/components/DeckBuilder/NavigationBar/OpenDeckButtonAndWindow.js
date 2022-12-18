import OpenDeckList from '../OpenDeckList'
import FunctionalityNavButton from '../../Generic/FunctionalityNavButton'
import { useState } from 'react'

const OpenDeckButtonAndWindow = ({ activeSubWindow, setActiveSubWindow }) => {
  const WINDOW_NAME = 'OPEN_DECK'
  const [openDeckIsOpen, setOpenDeckIsOpen] = useState(false)

  const toggleSaveDeck = () => {
    if (activeSubWindow === undefined && openDeckIsOpen === false) {
      setOpenDeckIsOpen(true)
      setActiveSubWindow(WINDOW_NAME)
    } else if (activeSubWindow === WINDOW_NAME && openDeckIsOpen === true) {
      setOpenDeckIsOpen(false)
      setActiveSubWindow(undefined)
    }
  }

  return(
    <div>
      <FunctionalityNavButton text='Open deck' onClick={toggleSaveDeck}/>
      { openDeckIsOpen === true
        ? <OpenDeckList toggleSaveDeck={toggleSaveDeck} />
        : null
      }
    </div>
  )
}

export default OpenDeckButtonAndWindow