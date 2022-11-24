import styled from 'styled-components'

const NoCardFieldsContainer = styled.div`
  ${props => props.theme.components.containers.addCardSetPopUpContainers.subContainer}
`

const WhenNoCardFieldsPage = () => {
  return(
    <NoCardFieldsContainer>
      <h3>Card set has no cards</h3>
    </NoCardFieldsContainer>
  )
}

export default WhenNoCardFieldsPage