import { useState, useRef, useContext } from 'react'
import styled from 'styled-components'
import AdditionalInfoIcon from '../../Generic/AdditionalInfoIcon'
import ShowCardExampleIcon from './ShowCardExampleIcon'
import { notificationMessageContext } from '../../../contexts/notificationMessageContext'
import ContentIsNotJSONError from './Notifications/ContentIsNotJSONError'

const OpenCardsJSONContainer = styled.div`
  ${props => props.theme.components.containers.addCardSetPopUpContainers.subContainer}
`

const InformationText = styled.div`
  margin: 0em 2em 0 0;
`

const rarityInfoText = 'Accepts values common, uncommon, rare and mythic'
const manaCostInfoText = `Accepts empty string, x, numbers and colors (black, blue, green, red and white). 
                         Should be in the form of <number> <colors> (e.g. 2 blue white).`

const OpenCardsJSONPage = ({ addCardsToCardSet }) => {
  const { showNotificationMessage } = useContext(notificationMessageContext)
  const [noCardsWillBeAdded, setNoCardsWillBeAdded] = useState(false)
  const [cardFileIsDisabled, setCardFileIsDisabled] = useState(false)
  const fileInputRef = useRef()

  const handleFileOpen = (event) => {
    event.preventDefault()
    let reader = new FileReader()
    reader.addEventListener('load', (event) => {
      const cardsInCardSet = event.target.result
      try {
        const cardsObject = JSON.parse(cardsInCardSet)
        addCardsToCardSet(cardsObject)
      } catch (error) {
        showNotificationMessage(ContentIsNotJSONError)
      }
    })
    reader.readAsText(event.target.files[0])
  }

  const handleNoCardsWillBeAdded = () => {
    setNoCardsWillBeAdded(!noCardsWillBeAdded)
    setCardFileIsDisabled(!cardFileIsDisabled)
    addCardsToCardSet([])
    fileInputRef.current.value = ''
  }

  return(
    <OpenCardsJSONContainer>
      <h3>Add card file</h3>
      <InformationText>
        Add a JSON file that has all the cards you want to add.
        Each card should have the following information
        <ShowCardExampleIcon />:
      </InformationText>
      <ul>
        <li>Name</li>
        <li>Price</li>
        <li>
          Rarity<AdditionalInfoIcon infoText={rarityInfoText} />
        </li>
        <li>Number of the card</li>
        <li>
          Mana cost<AdditionalInfoIcon infoText={manaCostInfoText} />
        </li>
        <li>Rules text</li>
      </ul>
      <div>
        No cards will be added <input type={'checkbox'} onChange={handleNoCardsWillBeAdded} />
      </div>
      <div>
        Cardfile: <input type={'file'} ref={fileInputRef} onChange={handleFileOpen} disabled={cardFileIsDisabled} />
      </div>
    </OpenCardsJSONContainer>
  )
}

export default OpenCardsJSONPage
