import styled from 'styled-components'

const BodyDiv = styled.div`
  flex: 1 0 auto;
  height: 0;
  overflow-y: auto;
`

const Body = ({ children }) => {
  return(
    <BodyDiv>
      {children}
    </BodyDiv>
  )
}

export default Body