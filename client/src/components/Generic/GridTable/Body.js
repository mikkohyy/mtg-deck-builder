import styled from 'styled-components'

const BodyDiv = styled.div`
  overflow-y: hidden;
  flex: 1 0 auto;
  height: 0;
  overflow-y: scroll;
`

const Body = ({ children }) => {
  return(
    <BodyDiv>
      {children}
    </BodyDiv>
  )
}

export default Body