import { useState, useRef, useContext, useEffect } from 'react'
import styled from 'styled-components'
import CardExample from './InfoElements/CardExample'
import { notificationContext } from '../../../../contexts/notificationContext'
import Notification from '../../../Generic/Notification'
import InformationPopUpBox from '../../../Generic/InformationPopUpBox'

const OpenCardsJSONContainer = styled.div`
  ${props => props.theme.components.containers.addCardSetPopUpContainers.subContainer}
  gap: 0.5em;
`

const InstructionText = styled.p`
  margin: 0
`

const rarityInfoText = 'Accepts values common, uncommon, rare and mythic'
const manaCostInfoText = `Accepts empty string, x, numbers and colors (black, blue, green, red and white). 
                         Should be in the form of <number> <colors> (e.g. 2 blue white).`

const OpenCardsJSON = ({ newCardSetDispatch }) => {
  const { showNotification } = useContext(notificationContext)
  const [cardSetHasCards, setCardSetHasCards] = useState(true)
  const [fileInputIsDisabled, setFileInputIsDisabled] = useState(false)
  const fileInputRef = useRef()

  useEffect(() => {
    let cards = []
    let keyNames = []

    if (shouldCardsAndKeysBeReseted() === true) {
      cards = undefined
      keyNames = undefined
    }

    newCardSetDispatch({
      type: 'SET_CARDS_AND_KEY_NAMES',
      payload: {
        cards: cards,
        keyNames: keyNames
      }
    })
  }, [cardSetHasCards])

  const shouldCardsAndKeysBeReseted = () => {
    let shouldBeReseted = false

    if (cardSetHasCards === true) {
      shouldBeReseted = true
    }

    return shouldBeReseted
  }

  const handleFileOpen = (event) => {
    event.preventDefault()
    let reader = new FileReader()
    reader.addEventListener('load', (event) => {
      const cardsInCardSet = event.target.result
      try {
        const cardsObject = JSON.parse(cardsInCardSet)
        addCardsToCardSet(cardsObject)
      } catch (error) {
        const header = 'There was a problem with the file'
        const message = 'The content of the file was not in JSON form'
        showNotification(<Notification header={header} message={message} />)
      }
    })
    reader.readAsText(event.target.files[0])
  }

  const addCardsToCardSet = (cards) => {
    if (cards.length > 0) {
      newCardSetDispatch({
        type: 'SET_CARDS_AND_KEY_NAMES',
        payload: {
          cards: cards,
          keyNames: Object.keys(cards[0])
        }
      })
    } else if (cards.length === 0) {
      newCardSetDispatch({
        type: 'SET_CARDS_AND_KEY_NAMES',
        payload: {
          cards: [],
          keyNames: []
        }
      })
    }
  }

  const handleNoCardsWillBeAdded = () => {
    setCardSetHasCards(!cardSetHasCards)
    setFileInputIsDisabled(!fileInputIsDisabled)
    fileInputRef.current.value = ''
  }

  return(
    <OpenCardsJSONContainer>
      <h3>Add card file</h3>
      <InstructionText>
        Add a JSON file that has all the cards you want to add.
        Each card should have the following information{' '}
        <InformationPopUpBox popUpBoxText='Example' information={<CardExample />} />
        :
      </InstructionText>
      <ul>
        <li>Name</li>
        <li>Price</li>
        <li>
          Rarity{' '}<InformationPopUpBox popUpBoxText='Info' information={rarityInfoText} />
        </li>
        <li>Number of the card</li>
        <li>
          Mana cost{' '}<InformationPopUpBox popUpBoxText='Info' information={manaCostInfoText} />
        </li>
        <li>Rules text</li>
      </ul>
      <div>
        No cards will be added <input type={'checkbox'} onChange={handleNoCardsWillBeAdded} />
      </div>
      <div>
        Cardfile: <input type={'file'} ref={fileInputRef} onChange={handleFileOpen} disabled={fileInputIsDisabled} />
      </div>
    </OpenCardsJSONContainer>
  )
}

export default OpenCardsJSON
33